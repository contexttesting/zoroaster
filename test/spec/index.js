const assert = require('assert')
const zoroaster = require('../..')
const { resolve } = require('path')
const { ChildProcess } = require('child_process')

const TEST_SUITE_PATH = resolve(__dirname, '../fixtures/test_suite.js')

const indexTestSuite = {
  'exports a function'() {
    assert.equal(typeof zoroaster, 'function')
  },
  async 'returns a child process'() {
    const proc = zoroaster()
    assert(proc instanceof ChildProcess)
    await proc.promise
  },
  async 'returns a promise'() {
    const proc = zoroaster()
    assert(proc.promise instanceof Promise)
    await proc.promise
  },
  async 'reports on 0 tests executed when empty args'() {
    const proc = zoroaster()
    assert(proc.promise instanceof Promise)
    const res = await proc.promise
    assert.equal('Executed 0 tests.', res.stdout.trim())
  },
  async 'should report on test suite executed'() {
    const proc = zoroaster([TEST_SUITE_PATH])
    assert(proc.promise instanceof Promise)
    const res = await proc.promise
    assert.equal(res.stderr, '')
    assert.equal(res.code, 1) // test fixtures not passing
    assert(res.stdout.length > 100)
  },
}

module.exports = indexTestSuite
