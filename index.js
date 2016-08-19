'use strict'

var vm = require('vm')
var flattenDeep = require('lodash.flattendeep')
var MemoryFileSystem = require('memory-fs')
var createRoutes = require('react-router').createRoutes
var webpack = require('webpack')

function extractPathFromRoute (route, prefix, options) {
  if (!route) {
    return []
  } else if (Array.isArray(route)) {
    return route.map(function (route) {
      return extractPathFromRoute(route, prefix, options)
    })
  } else if (!route.path) {
    return []
  } else if (prefix === '/' && route.path === '*') {
    return [options.errorPath]
  }

  var path = prefix + route.path
  var children = extractPathFromRoute(
    route.childRoutes,
    path === '/' ? path : path + '/',
    options
  )
  if (route.component) {
    return [path].concat(children)
  } else {
    return children
  }
}

function flattenPaths (routes) {
  return flattenDeep(extractPathFromRoute(routes, '', this.options))
}

function ReactRouterPathExtractorWebpackPlugin (routesFile, options, plugins) {
  if (typeof routesFile === 'object') {
    this.options = routesFile
    this.routesFile = this.options.routesFile
    this.plugins = options
  } else if (typeof routesFile === 'string') {
    this.routesFile = routesFile
    if (typeof options === 'function') {
      this.options = {}
      this.plugins = options
    } else {
      this.options = options
      this.plugins = plugins
    }
  }
  if (!this.routesFile) {
    throw new Error('routesFile is required')
  }
  if (typeof this.routesFile !== 'string') {
    throw new Error('routesFile must be a string')
  }
  if (typeof this.options !== 'object') {
    throw new Error('options must be an object')
  }
  if (typeof this.plugins !== 'function') {
    throw new Error('plugins must be a function')
  }
  this.options.errorPath = this.options.errorPath || '404'
}

ReactRouterPathExtractorWebpackPlugin.prototype.apply = function (compiler) {
  var self = this
  compiler.plugin('make', function (compilation, callback) {
    new Promise(function (resolve, reject) {
      const routesCompiler = webpack({
        context: compiler.context,
        entry: {
          routes: [self.routesFile]
        },
        output: {
          path: '/',
          filename: 'routes.js'
        },
        module: {
          loaders: compiler.options.module.loaders
        }
      })
      var fs = routesCompiler.outputFileSystem = new MemoryFileSystem()
      routesCompiler.run(function (err, stats) {
        if (err) { return reject(err) }
        try {
          var source = fs.readFileSync('/routes.js').toString()
          var script = new vm.Script(source, { filename: 'routes.vm' })
          var context = {}
          var routes = script.runInNewContext(context).routes
          resolve(routes)
        } catch (err) {
          reject(err)
        }
      })
    })
    .catch(callback)
    .then(createRoutes)
    .catch(callback)
    .then(flattenPaths.bind(self))
    .catch(callback)
    .then(function (paths) {
      self.plugins(paths).forEach(function (plugin) {
        plugin.apply(compiler)
      })
      callback()
    })
  })
}

module.exports = ReactRouterPathExtractorWebpackPlugin
