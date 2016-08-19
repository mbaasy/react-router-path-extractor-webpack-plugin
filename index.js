'use strict'

var vm = require('vm')
var flattenDeep = require('lodash.flattendeep')
var MemoryFileSystem = require('memory-fs')
var createRoutes = require('react-router').createRoutes
var webpack = require('webpack')

function extractPathFromRoute (route, prefix = '') {
  if (!route) {
    return []
  } else if (Array.isArray(route)) {
    return route.map(function (route) {
      return extractPathFromRoute(route, prefix)
    })
  } else if (!route.path) {
    return []
  }
  var path = prefix + route.path
  var children = extractPathFromRoute(
    route.childRoutes,
    path === '/' ? path : path + '/'
  )
  if (route.component) {
    return [path].concat(children)
  } else {
    return children
  }
}

function flattenPaths (routes) {
  return flattenDeep(extractPathFromRoute(routes))
}

function ReactRouterPathExtractorWebpackPlugin (routesFile, plugins) {
  this.routesFile = routesFile
  this.plugins = plugins
}

ReactRouterPathExtractorWebpackPlugin.prototype.apply = function (compiler) {
  var self = this
  compiler.plugin('make', function (compilation, callback) {
    new Promise((resolve, reject) => {
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
    .then(flattenPaths)
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
