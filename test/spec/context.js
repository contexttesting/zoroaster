const assert = require('assert')
const path = require('path')
const TestSuite = require('../../src/test_suite')
const Test = require('../../src/test')

const testSuiteName = 'Zoroaster Context Test Suite'
const testName = 'Zoroaster Context Test'
const testFn = () => {}
const context = {
    program: 'zoroaster',
}

const TestSuiteContext = {
    'should throw an error when context passed is not an object': () => {
        try {
            new TestSuite(testSuiteName, {}, null, 'context')
            throw new Error('Context is not an object error should have been thrown.')
        } catch (err) {
            assert(err.message === 'Context must be an object.')
        }
    },
    'should throw an error when context passed is null': () => {
        try {
            new TestSuite(testSuiteName, {}, null, null)
            throw new Error('Context is null error should have been thrown.')
        } catch (err) {
            assert(err.message === 'Context cannot be null.')
        }
    },
    'should create a test suite with a context': () => {
        const testSuite = new TestSuite(testSuiteName, {}, null, context)
        assert(testSuite.context === context)
    },
    'should freeze passed context': () => {
        const testSuite = new TestSuite(testSuiteName, {}, null, context)
        assert(testSuite.context === context)
        assert(Object.isFrozen(testSuite.context))
    },
    'should pass context to children test suites': () => {
        const testSuite = new TestSuite(testSuiteName, {
            test_suite: {
                test: () => {},
            },
        }, null, context)
        return testSuite.run()
            .then(() => {
                testSuite.tests.forEach((test) => {
                    assert(test.context === context)
                })
            })
    },
    'should pass context to tests': () => {
        const testSuite = new TestSuite(testSuiteName, {
            test: () => {},
        }, null, context)
        return testSuite.run()
            .then(() => {
                testSuite.tests.forEach((test) => {
                    assert(test.context === context)
                })
            })
    },
}

const TestContext = {
    'should throw an error when context passed is not an object': () => {
        try {
            new Test(testName, testFn, null, 'context')
            throw new Error('Context is not an object error should have been thrown.')
        } catch (err) {
            assert(err.message === 'Context must be an object.')
        }
    },
    'should throw an error when context passed is null': () => {
        try {
            new Test(testName, testFn, null, null)
            throw new Error('Context is null error should have been thrown.')
        } catch (err) {
            assert(err.message === 'Context cannot be null.')
        }
    },
    'should create a test with a context': () => {
        const test = new Test(testName, testFn, null, context)
        assert(test.context === context)
    },
    'should freeze passed context': () => {
        const test = new Test(testName, testFn, null, context)
        assert(test.context === context)
        assert(Object.isFrozen(test.context))
    },
    'should pass context as first argument to function': () => {
        const testFnWithContext = (ctx) => {
            assert(ctx === context)
        }
        const test = new Test(testName, testFnWithContext, null, context)
        return test.run()
            .then((res) => {
                assert(test.error === null)
            })
    },
}

module.exports = {
    'test suite context': TestSuiteContext,
    'test context': TestContext,
}
