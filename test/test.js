'use strict'

import { describe, it, before } from 'mocha'
import { expect } from 'chai'
import webpack from 'webpack'
import ReactRouterPathExtractorWebpackPlugin from '../index'
import StaticSiteGeneratorWebpackPlugin from 'static-site-generator-webpack-plugin'
import MemoryFileSystem from 'memory-fs'
import nestedPaths from './app/nestedPaths'

const compiler = webpack({
  context: __dirname,
  entry: {
    main: ['./app/entry.js']
  },
  output: {
    path: '/',
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
    new ReactRouterPathExtractorWebpackPlugin('./app/routes.js', (paths) => [
      new StaticSiteGeneratorWebpackPlugin('main', paths)
    ])
  ]
})
const fs = compiler.outputFileSystem = new MemoryFileSystem()

describe('ReactRouterPathExtractorWebpackPlugin', () => {
  let error = []

  before(function (done) {
    this.timeout(5000)
    compiler.run((err, stats) => {
      error = err
      done()
    })
  })

  const shouldContainFile = (path, file = 'index.html') => {
    it(`should contain "${file}"`, () => {
      expect(fs.readdirSync(path)).to.include.members([file])
    })
  }

  const shouldNotContainFile = (path, file = 'index.html') => {
    it(`should not contain "${file}"`, () => {
      expect(fs.readdirSync(path)).to.not.include.members([file])
    })
  }

  const traverseNestedPaths = (routes, base) => {
    routes.forEach((route) => {
      describe(base + route.path, () => {
        if (route.component) {
          shouldContainFile(base + route.path)
        } else {
          shouldNotContainFile(base + route.path)
        }
        if (route.childRoutes) {
          traverseNestedPaths(route.childRoutes, base + route.path + '/')
        }
      })
    })
  }

  describe('compiler', () => {
    it('should not error', () => {
      expect(error).to.be.null
    })
  })

  describe('output', () => {
    describe('/', () => {
      shouldContainFile('/', 'main.js')
      shouldContainFile('/')
      describe('/nested', () => {
        traverseNestedPaths(nestedPaths, '/nested/')
      })
    })
  })
})
