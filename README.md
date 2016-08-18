# ReactRouterPathExtractorWebpackPlugin

Designed to work with [StaticSiteGeneratorWebpackPlugin](https://github.com/markdalgleish/static-site-generator-webpack-plugin) and [SitemapPlugin](https://github.com/markdalgleish/static-site-generator-webpack-plugin).

## Usage

```javascript
import ReactRouterPathExtractorWebpackPlugin from 'react-router-path-extractor-webpack-plugin'
import StaticSiteGeneratorWebpackPlugin from 'static-site-generator-webpack-plugin'
import SitemapPlugin from 'sitemap-webpack-plugin'

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
         '/contact'
       ]
       Apply the paths to plugins that require them:
      */
      new StaticSiteGeneratorWebpackPlugin('main', paths),
      new SitemapPlugin('http://example.com', paths)
    ])
  ]
})
```

## Limitations

This plugin does not work with [Dynamic Routing](https://github.com/reactjs/react-router/blob/1.0.x/docs/guides/advanced/DynamicRouting.md).

## Roadmap

- [ ] Add test coverage
- [ ] Handle error pages
- [ ] Handle Dynamic routing

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
