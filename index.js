'use strict'

var vm = require('vm')
var MemoryFileSystem = require('memory-fs')
var createRoutes = require('react-router').createRoutes
var webpack = require('webpack')

function compileRoutes (config) {
  return new Promise(function (resolve, reject) {
    var compiler = webpack(config)
    var fs = compiler.outputFileSystem = new MemoryFileSystem()
    compiler.run(function (err, stats) {
      if (err) { return reject(err) }
      resolve(fs)
    })
  })
}

function executeRoutes (fs) {
  return new Promise(function (resolve, reject) {
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
}

function flattenRoutes (routes, base, paths) {
  return routes.reduce(function (paths, route) {
    var path = route.path === '*' ? route.staticName || 'nomatch' : route.path
    path = /^\//.test(path) ? path : base + path
    if (!route.staticExclude) { paths.push(path) }
    if (route.childRoutes) {
      var nextBase = /\/$/.test(path) ? path : path + '/'
      paths = flattenRoutes(route.childRoutes, nextBase, paths)
    }
    return paths
  }, paths || [])
}

function ReactRouterPathExtractorWebpackPlugin (routesFile, options, plugins) {
  var args = Array.prototype.splice.call(arguments, 0, 3)
  switch (args.length) {
    case 3:
      this.routesFile = args[0]
      this.options = args[1]
      this.plugins = args[2]
      break
    case 2:
      if (args[0] && typeof args[0] === 'object') {
        this.options = args[0]
        this.plugins = args[1]
        this.routesFile = this.options.routesFile
      } else {
        this.routesFile = args[0]
        this.plugins = args[1]
        this.options = {}
      }
      break
    default:
      throw Error('Invalid arguments')
  }
  if (!this.routesFile) {
    throw new Error('A routesFile is required')
  }
  if (typeof this.routesFile !== 'string') {
    throw new Error('The routesFile must be a string')
  }
  if (typeof this.options !== 'object') {
    throw new Error('Options must be an object')
  }
  if (typeof this.plugins !== 'function') {
    throw new Error('Callback must be a function')
  }
}

ReactRouterPathExtractorWebpackPlugin.prototype.apply = function (compiler) {
  var self = this
  compiler.plugin('make', function (compilation, callback) {
    compileRoutes({
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
    .catch(callback)
    .then(executeRoutes)
    .catch(callback)
    .then(function (routes) {
      try {
        return createRoutes(routes)
      } catch (err) {
        throw err
      }
    })
    .catch(callback)
    .then(function (routes) {
      var paths = flattenRoutes(routes)
      if (typeof self.plugins === 'function') {
        self.plugins(paths, routes).forEach(function (plugin) {
          plugin.apply(compiler)
        })
        callback(null, routes)
      }
    })
  })
}

module.exports = ReactRouterPathExtractorWebpackPlugin
