'use strict'

const assert = require('assert')
const TestSuite = require('../../src/test_suite')
const lib = require('../lib')
const TEST_SUITE_NAME = 'test-suite'

module.exports = {
    'context as a function will be executed for each test': () => {
        const testData = 'some-test-data'
        const newTestData = 'some-new-test-data'
        const propName = 'testData'
        let getterCalled = false
        let setterCalled = false
        let firstContext
        let secondContext

        const makeContext = function Context() {
            let _testData = testData
            getterCalled = false
            setterCalled = false
            Object.defineProperty(this, propName, {
                get: () => {
                    getterCalled = true
                    return _testData
                },
                set: (value) => {
                    setterCalled = true
                    _testData = value
                },
            })
        }

        const testSuite = new TestSuite(TEST_SUITE_NAME, {
            testA: (ctx) => {
                assert(!getterCalled)
                assert(!setterCalled)
                assert.equal(ctx.testData, testData)
                assert(getterCalled)
                ctx.testData = newTestData
                assert(setterCalled)
                assert.equal(ctx.testData, newTestData)
                firstContext = ctx
            },
            testB: (ctx) => { // context is called each time for every test
                assert(!getterCalled)
                assert(!setterCalled)
                assert.equal(ctx.testData, testData)
                assert(getterCalled)
                secondContext = ctx
            },
        }, null, makeContext)
        return testSuite.run()
            .then(() => {
                lib.assertNoErrosInTestSuite(testSuite)
                assert.notStrictEqual(firstContext, secondContext)
                assert.equal(firstContext[propName], newTestData)
                assert.equal(secondContext[propName], testData)
            })
    },
    'context as a function will be executed for each test (as prop)': () => {
        const testData = 'some-test-data'
        const newTestData = 'some-new-test-data'
        const propName = 'testData'
        let getterCalled = false
        let setterCalled = false
        let firstContext
        let secondContext

        const makeContext = function Context() {
            let _testData = testData
            getterCalled = false
            setterCalled = false
            Object.defineProperty(this, propName, {
                get: () => {
                    getterCalled = true
                    return _testData
                },
                set: (value) => {
                    setterCalled = true
                    _testData = value
                },
            })
        }

        const testSuite = new TestSuite(TEST_SUITE_NAME, {
            context: makeContext,
            testA: (ctx) => {
                assert(!getterCalled)
                assert(!setterCalled)
                assert.equal(ctx.testData, testData)
                assert(getterCalled)
                ctx.testData = newTestData
                assert(setterCalled)
                assert.equal(ctx.testData, newTestData)
                firstContext = ctx
            },
            testB: (ctx) => { // context is called each time for every test
                assert(!getterCalled)
                assert(!setterCalled)
                assert.equal(ctx.testData, testData)
                assert(getterCalled)
                secondContext = ctx
            },
        })
        return testSuite.run()
            .then(() => {
                lib.assertNoErrosInTestSuite(testSuite)
                assert.notStrictEqual(firstContext, secondContext)
                assert.equal(firstContext[propName], newTestData)
                assert.equal(secondContext[propName], testData)
            })
    },
    'should wait until promise returned by context is resolved': () => {
        const testData = 'some-test-data'
        const testDataAfterPromise = 'test-data-after-promise'
        const newTestData = 'some-new-test-data'
        let firstContext
        let secondContext
        const propName = 'testData'

        const makeContext = function Context() {
            let _testData = testData
            Object.defineProperty(this, propName, {
                get: () => {
                    return _testData
                },
                set: (value) => {
                    _testData = value
                },
            })
            return new Promise(r => {
                setTimeout(() => {
                    _testData = testDataAfterPromise
                    r()
                }, 50)
            })
        }

        const testSuite = new TestSuite(TEST_SUITE_NAME, {
            context: makeContext,
            testA: (ctx) => {
                assert.equal(ctx.testData, testDataAfterPromise)
                ctx.testData = newTestData
                firstContext = ctx
            },
            testB: (ctx) => {
                assert.equal(ctx.testData, testDataAfterPromise)
                secondContext = ctx
            },
        })
        return testSuite.run()
            .then(() => {
                lib.assertNoErrosInTestSuite(testSuite)
                assert.notStrictEqual(firstContext, secondContext)
                assert.equal(firstContext[propName], newTestData)
                assert.equal(secondContext[propName], testDataAfterPromise)
            })
    },
    'should timeout before context finishes resolving': () => {
        const makeContext = function Context() {
            return new Promise(r => setTimeout(r, 200))
        }
        const testSuite = new TestSuite(TEST_SUITE_NAME, {
            'should timeout': () => {},
        }, null, makeContext, 150)
        return testSuite.run()
            .then(() => {
                assert.throws(
                    () => lib.assertNoErrosInTestSuite(testSuite),
                    /Error in test "test-suite > should timeout": Evaluate has timed out after 150ms/
                )
            })
    },
}
