'use strict'

import { describe, it, before } from 'mocha'
import { expect } from 'chai'
import webpack from 'webpack'
import MemoryFileSystem from 'memory-fs'
import Plugin from '../index'
import config, { data } from './webpack.config'

const compiler = webpack({...config, output: {...config.output, path: '/'}})
compiler.outputFileSystem = new MemoryFileSystem()

describe('ReactRouterPathExtractorWebpackPlugin', () => {
  describe('constructor', () => {
    const subject = (...args) => () => new Plugin(...args)

    describe('0 arguments', () => {
      it('should throw an error', () => {
        expect(subject()).to.throw(Error, 'Invalid arguments')
      })
    })

    describe('1 argument', () => {
      it('should throw an error', () => {
        expect(subject()).to.throw(Error, 'Invalid arguments')
      })
    })
  })

  describe('.apply', () => {
    let error = null

    before(function (done) {
      this.timeout(5000)
      compiler.run((err, stats) => {
        error = err
        done()
      })
    })

    describe('compiler', () => {
      it('should not error', () => {
        expect(error).to.be.null
      })
    })

    describe('callback', () => {
      it('should include the expected paths', () => {
        var expected = [
          '/',
          '/nested/1',
          '/nested/1/1.1/1.1.1',
          '/nested/1/1.2/1.2.1',
          '/nested/1/1.2/1.2.1/1.2.1.1',
          '/nested/2',
          '/nested/2/2.1/2.1.1',
          '/foobar',
          '/foobar/whatever',
          '/foobar/whatever/something/something',
          '/foobar/whatever/nomatch',
          '/error'
        ]
        expect(data.paths).to.have.members(expected)
      })

      it('should exculde the expected paths', () => {
        var unexpected = [
          '/nested',
          '/nested/1/1.1',
          '/nested/1/1.2',
          '/nested/2/2.1'
        ]
        expect(data.paths).to.not.have.members(unexpected)
      })
    })
  })
})
