'use strict'

import { describe, it, before } from 'mocha'
import { expect } from 'chai'
import webpack from 'webpack'
import ReactRouterPathExtractorWebpackPlugin from '../index'
import StaticSiteGeneratorWebpackPlugin from 'static-site-generator-webpack-plugin'
import MemoryFileSystem from 'memory-fs'
import nestedPaths from './app/nestedPaths'

const configure = (plugins) => {
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
    plugins
  })
  compiler.outputFileSystem = new MemoryFileSystem()
  return compiler
}

describe('ReactRouterPathExtractorWebpackPlugin', () => {
  let error = []
  let compiler = null

  const shouldBehaveNormally = (errorPath) => {
    describe('compiler', () => {
      it('should not error', () => {
        expect(error).to.be.null
      })
    })

    describe('output', () => {
      describe('/', () => {
        shouldContainFile('/', 'main.js')
        shouldContainFile(`/${errorPath}`, 'index.html')
        shouldContainFile('/')
        describe('/nested', () => {
          traverseNestedPaths(nestedPaths, '/nested/')
        })
      })
    })
  }

  const shouldContainFile = (path, file = 'index.html') => {
    it(`should contain "${path === '/' ? '' : path}/${file}"`, () => {
      expect(compiler.outputFileSystem.readdirSync(path)).to.include.members([file])
    })
  }

  const shouldNotContainFile = (path, file = 'index.html') => {
    it(`should not contain "${path === '/' ? '' : path}/${file}"`, () => {
      expect(compiler.outputFileSystem.readdirSync(path)).to.not.include.members([file])
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

  describe('(routesFile, callback)', () => {
    before(function (done) {
      this.timeout(5000)
      compiler = configure([
        new ReactRouterPathExtractorWebpackPlugin('./app/routes.js', (paths) => [
          new StaticSiteGeneratorWebpackPlugin('main', paths)
        ])
      ])
      compiler.run((err, stats) => {
        error = err
        done()
      })
    })

    shouldBehaveNormally('404')
  })

  describe('(routesFile, options, callback)', () => {
    before(function (done) {
      this.timeout(5000)
      compiler = configure([
        new ReactRouterPathExtractorWebpackPlugin('./app/routes.js', {
          errorPath: 'notHere'
        }, (paths) => [
          new StaticSiteGeneratorWebpackPlugin('main', paths)
        ])
      ])
      compiler.run((err, stats) => {
        error = err
        done()
      })
    })

    shouldBehaveNormally('notHere')
  })

  describe('(options, callback)', () => {
    before(function (done) {
      this.timeout(5000)
      compiler = configure([
        new ReactRouterPathExtractorWebpackPlugin({
          routesFile: './app/routes.js',
          errorPath: 'notFound'
        }, (paths) => [
          new StaticSiteGeneratorWebpackPlugin('main', paths)
        ])
      ])
      compiler.run((err, stats) => {
        error = err
        done()
      })
    })

    shouldBehaveNormally('notFound')
  })
})
