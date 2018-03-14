const assert = require('assert')
const assertSrc = require('../../../assert')
const throws = assertSrc.throws
const equal = assert.equal
const strictEqual = assert.strictEqual

const throwsTestSuite = {
  'asserts on async error'() {
    return throws({
      fn() {
        const err = new Error('test-error')
        return Promise.reject(err)
      },
      message: 'test-error',
    })
  },
  'asserts on sync error and fail'() {
    return throws({
      fn() { },
    }).catch((error) => {
      equal(error.message, 'Function should have thrown')
    })
  },
  'asserts on async error by code and fail'() {
    return throws({
      fn() {
        const err = new Error('test-error')
        err.code = 'TER'
        return Promise.reject(err)
      },
      code: 'TERRA',
    }).catch((error) => {
      equal(error.message, 'TER != TERRA')
    })
  },
  'throws when asserting on error strict equality'() {
    const error = new Error('test-error')
    return throws({
      fn() {
        return Promise.reject(error)
      },
      error: new Error('test-error-assert'),
    }).catch((error) => {
      equal(error.message, 'Error: test-error is not strict equal to Error: test-error-assert.')
    })
  },
  'asserts on error strict equality'() {
    const error = new Error('test-error')
    return throws({
      fn() {
        return Promise.reject(error)
      },
      error,
    })
  },
  'asserts on error message with regular expression'() {
    return throws({
      fn() {
        return Promise.reject(new Error('test-error'))
      },
      message: /test-error/,
    })
  },
  'returns the thrown error'() {
    const error = new Error('test-error')
    return throws({
      fn() {
        return Promise.reject(error)
      },
      message: /test-error/,
    }).then((res) => {
      strictEqual(res, error)
    })
  },
  'throws when asserting on error message with regular expression'() {
    return throws({
      fn() {
        return Promise.reject(new Error('test-error'))
      },
      message: /test-error-assert/,
    }).catch((error) => {
      equal(error.message, 'test-error does not match regular expression /test-error-assert/')
    })
  },
}

module.exports = throwsTestSuite
