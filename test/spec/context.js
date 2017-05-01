const assert = require('assert')
const path = require('path')
const TestSuite = require('../../src/test_suite')
const Test = require('../../src/test')

const testSuiteName = 'Zoroaster Context Test Suite'
const testName = 'Zoroaster Context Test'
const testFn = () => {}

function createContext() {
    return {
        name: 'Zarathustra',
        getCountry: () => 'Iran',
        born: -628,
        died: -551,
    }
}

const TestSuiteContext = {
    'should throw an error when context passed is not an object': () => {
        assert.throws(
            () => new TestSuite(testSuiteName, {}, null, 'context'),
            /Context must be an object./
        )
    },
    'should throw an error when context passed is null': () => {
        assert.throws(
            () => new TestSuite(testSuiteName, {}, null, null),
            /Context cannot be null./
        )
    },
    'should create a test suite with a context': () => {
        const context = createContext()
        const testSuite = new TestSuite(testSuiteName, {}, null, context)
        assert.equal(testSuite.context, context)
    },
    'should freeze passed context': () => {
        const context = createContext()
        const testSuite = new TestSuite(testSuiteName, {}, null, context)
        assert(Object.isFrozen(testSuite.context))
    },
    'should pass context to child test suites': () => {
        const context = createContext()
        const testSuite = new TestSuite(testSuiteName, {
            test_suite: {
                test: () => {},
            },
        }, null, context)
        return testSuite.run()
            .then(() => {
                testSuite.tests.forEach((test) => {
                    assert.equal(test.context, context)
                })
            })
    },
    'should pass context to tests': () => {
        const context = createContext()
        const testSuite = new TestSuite(testSuiteName, {
            test: () => {},
        }, null, context)
        return testSuite.run()
            .then(() => {
                testSuite.tests.forEach((test) => {
                    assert.equal(test.context, context)
                })
            })
    },
}

const TestSuiteContextFromTests = {
    'should throw an error when context supplied is not an object': () => {
        assert.throws(
            () => new TestSuite(testSuiteName, { context: 'context' }),
            /Context must be an object./
        )
    },
    'should throw an error when context supplied is null': () => {
        assert.throws(
            () => new TestSuite(testSuiteName, { context: null }),
            /Context cannot be null./
        )
    },
    'should add context from passed object': () => {
        const context = createContext()
        const testSuite = new TestSuite(testSuiteName, {
            context,
            test: () => {},
        })
        assert.notEqual(testSuite.context, context)
        assert.deepEqual(testSuite.context, context)
    },
    'should freeze supplied context': () => {
        const context = createContext()
        const testSuite = new TestSuite(testSuiteName, {
            context,
            test: () => {},
        })
        assert(Object.isFrozen(testSuite.context))
    },
    'should not add context as a test': () => {
        const test = () => {}
        const tests = {
            test,
            context: createContext(),
        }
        const testSuite = new TestSuite(testSuiteName, tests)
        assert.equal(testSuite.tests.length, 1)
        assert.equal(testSuite.tests[0].fn, test)
    },
    'should extend current context': () => {
        const context = createContext()
        const existingContext = {
            phenomena: ['act', 'speech', 'thought'],
            Činvat: 'Bridge of the Requiter',
            humans: () => 'Responsibility for fate',
        }
        const testSuite = new TestSuite(testSuiteName, {
            context,
            test: () => {},
        }, null, existingContext)
        const expected = Object.assign({}, existingContext, context)
        assert.deepEqual(testSuite.context, expected)
    },
    'should pass supplied context to tests': () => {
        const context = createContext()
        const testSuite = new TestSuite(testSuiteName, {
            context,
            test: (ctx) => {
                assert.deepEqual(ctx, context)
            },
        })
        return testSuite.run()
            .then(() => {
                testSuite.tests.forEach((test) => {
                    assert.equal(test.error, null)
                })
            })
    },
}

const TestContext = {
    'should throw an error when context passed is not an object': () => {
        assert.throws(
            () => new Test(testName, testFn, null, 'context'),
            /Context must be an object./
        )
    },
    'should throw an error when context passed is null': () => {
        assert.throws(
            () => new Test(testName, testFn, null, null),
            /Context cannot be null./
        )
    },
    'should create a test with a context': () => {
        const context = createContext()
        const test = new Test(testName, testFn, null, context)
        assert.equal(test.context, context)
    },
    'should freeze passed context': () => {
        const context = createContext()
        const test = new Test(testName, testFn, null, context)
        assert.equal(test.context, context)
        assert(Object.isFrozen(test.context))
    },
    'should pass context as first argument to function': () => {
        const context = createContext()
        const testFnWithContext = (ctx) => {
            assert.equal(ctx, context)
        }
        const test = new Test(testName, testFnWithContext, null, context)
        return test.run()
            .then((res) => {
                assert.equal(test.error, null)
            })
    },
}

module.exports = {
    'test suite context': TestSuiteContext,
    'test context': TestContext,
    'test suite context from tests': TestSuiteContextFromTests,
}
