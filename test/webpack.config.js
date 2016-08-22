'use strict'

var ReactRouterPathExtractorWebpackPlugin = require('../index')
var StaticSiteGeneratorWebpackPlugin = require('static-site-generator-webpack-plugin')

var data = {}

module.exports = {
  context: __dirname,
  entry: {
    main: ['./app/entry.js']
  },
  output: {
    path: './_output',
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['react', 'es2015', 'stage-0']
      }
    }]
  },
  plugins: [
    new ReactRouterPathExtractorWebpackPlugin('./app/routes.js', (paths, routes) => {
      data.paths = paths
      data.routes = routes
      return [new StaticSiteGeneratorWebpackPlugin('main', paths)]
    })
  ]
}

module.exports.data = data
