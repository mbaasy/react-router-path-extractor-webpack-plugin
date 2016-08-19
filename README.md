# ReactRouterPathExtractorWebpackPlugin

[![Build Status](https://travis-ci.org/mbaasy/react-router-path-extractor-webpack-plugin.svg?branch=master)](https://travis-ci.org/mbaasy/react-router-path-extractor-webpack-plugin) [![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Introduction

This plugin is esigned to work with [StaticSiteGeneratorWebpackPlugin](https://github.com/markdalgleish/static-site-generator-webpack-plugin) and [SitemapPlugin](https://github.com/markdalgleish/static-site-generator-webpack-plugin). It has no standalone functionality other than to precompile a [React Router](https://github.com/reactjs/react-router) routes file and pass the discovered `paths` into a callback.

The callback expects an array of plugins to be returned.

## Usage

#### webpack.config.js
```javascript
var webpack = require('webpack')
var ReactRouterPathExtractorWebpackPlugin = require('react-router-path-extractor-webpack-plugin')
var StaticSiteGeneratorWebpackPlugin = require('static-site-generator-webpack-plugin')
var SitemapPlugin = require('sitemap-webpack-plugin')

module.exports = webpack({
  entry: {
    main: ['./src/entry.js']
  },
  output: {
    path: path.resolve(__dirname, '_dist'),
    filename: '[name].[hash].js',
    libraryTarget: 'umd',
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['react', 'es2015']
      }
    }]
  },
  plugins: [
    new ReactRouterPathExtractorWebpackPlugin('./src/routes.js', (paths) => [
      /*
       The callback receives a flat array of paths, e.g.
       [
         '/',
         '/about',
         '/about/contact'
       ]
       Apply the paths to plugins that require them:
      */
      new StaticSiteGeneratorWebpackPlugin('main', paths),
      new SitemapPlugin('http://example.com', paths)
    ])
  ]
})
```

#### routes.js
```javascript
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './components/App'
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'

// Important: Your routes must be a named export called "routes":
export const routes = (
  // You can Route and PlainRoute together
  <Route path='/' component={App}>
    <IndexRoute component={Home} title='Home' />
    <Route path='about'>
      <IndexRoute component={About} title='About' />
      <Route path='contact' component={Contact} title='Contact' />
    </Route>
  </Route>
)

// You can always export the routes as default too
export default routes
```

## Limitations

This plugin does not work with [Dynamic Routing](https://github.com/reactjs/react-router/blob/1.0.x/docs/guides/advanced/DynamicRouting.md).

## Roadmap

- [ ] [Add test coverage](https://github.com/mbaasy/react-router-path-extractor-webpack-plugin/issues/1)
- [ ] [Handle error pages](https://github.com/mbaasy/react-router-path-extractor-webpack-plugin/issues/2)
- [ ] [Handle dynamic routing](https://github.com/mbaasy/react-router-path-extractor-webpack-plugin/issues/3)

## Report an Issue

* [Bugs](https://github.com/mbaasy/react-router-path-extractor-webpack-plugin/issues)
* Contact the author: [hello@mbaasy.com](hello@mbaasy.com)

## MIT License

> Copyright (c) 2016 [Mbaasy, Inc](https://mbaasy.com/)

> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
