const assert = require('assert')
const assertSrc = require('../../../assert')
const throws = assertSrc.throws
const equal = assert.equal

const throwsTestSuite = {
    'should assert on async error'() {
        return throws({
            fn() {
                const err = new Error('test-error')
                return Promise.reject(err)
            },
            message: 'test-error',
        })
    },
    'should assert on sync error and fail'() {
        return throws({
            fn() { },
        }).catch((error) => {
            equal(error.message, 'Function should have thrown')
        })
    },
    'should assert on async error by code and fail'() {
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
    'should throw when asserting on error strict equality'() {
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
    'should assert on error strict equality'() {
        const error = new Error('test-error')
        return throws({
            fn() {
                return Promise.reject(error)
            },
            error,
        })
    },
    'should assert on error message with regular expression'() {
        return throws({
            fn() {
                return Promise.reject(new Error('test-error'))
            },
            message: /test-error/,
        })
    },
    'should throw when asserting on error message with regular expression'() {
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
