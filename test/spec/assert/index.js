const assert = require('assert')
const assertSrc = require('../../../assert')

const equal = assertSrc.equal
const deepEqual = assertSrc.deepEqual
const throws = assertSrc.throws
const testAssert = assertSrc.assert

const assertTestSuite = {
    'should throw if not equal'() {
        try {
            equal('a', 'b')
            throw new Error('should have thrown')
        } catch (error) {
            assert.equal(error.operator, '==')
            assert.equal(error.actual, 'a')
            assert.equal(error.expected, 'b')
        }
    },
    'should throw if not deep equal'() {
        try {
            deepEqual({ test: 'string' }, { test: 'string-2' })
            throw new Error('should have thrown')
        } catch (error) {
            const message = error.message
            assert(/\+ {2}test: "string"/.test(message))
            assert(/- {2}test: "string-2"/.test(message))
        }
    },
    'should throw if not true'() {
        try {
            testAssert(false)
            throw new Error('should have thrown')
        } catch (error) {
            const message = error.message
            assert.equal(message, 'false == true')
        }
    },
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
            assert.equal(error.message, 'Function should have thrown')
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
            assert.equal(error.message, 'TER != TERRA')
        })
    },
}

module.exports = assertTestSuite
