const assert = require('assert')
const zoroaster = require('../../index')
const path = require('path')

const TEST_SUITE_PATH = path.join(__dirname, '../fixtures/test_suite.js')

const indexTestSuite = {
  'should export a function': () => {
    assert.equal(typeof zoroaster, 'function')
  },
  'should return a child process': () => {
    const proc = zoroaster()
    assert(proc instanceof require('child_process').ChildProcess)
    return proc.promise
  },
  'should return a promise': () => {
    const proc = zoroaster()
    assert(proc.promise instanceof Promise)
    return proc.promise
  },
  'should report on 0 tests executed when empty args': () => {
    const proc = zoroaster()
    assert(proc.promise instanceof Promise)
    return proc.promise
      .then((res) => {
        assert.equal('Executed 0 tests.', res.stdout.trim())
      })
  },
  'should report on test suite executed': () => {
    const proc = zoroaster([TEST_SUITE_PATH])
    assert(proc.promise instanceof Promise)
    return proc.promise
      .then((res) => {
        assert.equal(res.stderr, '')
        assert.equal(res.code, 1) // test fixtures not passing
        assert(res.stdout.length > 100)
      })
  },
}

module.exports = indexTestSuite
