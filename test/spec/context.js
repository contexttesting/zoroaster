const assert = require('assert')
const TestSuite = require('../../src/test_suite')
const Test = require('../../src/test')
const assertNoErrosInTestSuite = require('../lib').assertNoErrosInTestSuite

const testSuiteName = 'Zoroaster Context Test Suite'
const testName = 'Zoroaster Context Test'
const testFn = () => {}

function createContext() {
    return {
        name: 'Zarathustra',
        country: 'Iran',
        born: -628,
        died: -551,
    }
}
function getExistingContext() {
    return {
        phenomena: ['act', 'speech', 'thought'],
        Činvat: 'Bridge of the Requiter',
        humans: () => 'Responsibility for fate',
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
    'should create a test suite with a cloned context': () => {
        const context = createContext()
        const testSuite = new TestSuite(testSuiteName, {}, null, context)
        assert.notStrictEqual(testSuite.context, context)
        assert.deepEqual(testSuite.context, context)
    },
    'should freeze context after creation': () => {
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
                testSuite.tests.forEach((childTestSuite) => {
                    assert(childTestSuite instanceof TestSuite)
                    assert.equal(childTestSuite.context, testSuite.context)
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
                    assert.equal(test.context, testSuite.context)
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
        assert.notStrictEqual(testSuite.context, context)
        assert.deepEqual(testSuite.context, context)
    },
    'should freeze supplied context': () => {
        const context = createContext()
        assert(!Object.isFrozen(context))
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
        const existingContext = getExistingContext()
        const context = createContext()
        const testSuite = new TestSuite(testSuiteName, {
            context,
            test: () => {},
        }, null, existingContext)
        const expected = Object.assign({}, existingContext, context)
        assert.deepEqual(testSuite.context, expected)
    },
    'should pass supplied context to tests': () => {
        const context = createContext()
        const existingContext = getExistingContext()
        const totalContext = Object.assign({}, existingContext, context)
        const testSuite = new TestSuite(testSuiteName, {
            context,
            test: (ctx) => {
                assert.deepEqual(ctx, context)
            },
            innerTestSuite: {
                context: existingContext,
                test: (ctx) => {
                    assert.deepEqual(ctx, totalContext)
                },
            },
        })
        return testSuite.run()
            .then(() => {
                assertNoErrosInTestSuite(testSuite)
            })
    },
    'should not be able to update context from tests': () => {
        const context = createContext()
        const testSuite = new TestSuite(testSuiteName, {
            context,
            test: (ctx) => {
                ctx.born = 0
            },
        })
        return testSuite.run()
            .then(() => {
                assert.deepEqual(context, createContext())
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
        assert.strictEqual(test.context, context)
    },
    'should pass context as first argument to function': () => {
        const context = createContext()
        const testFnWithContext = (ctx) => {
            assert.equal(ctx, context)
        }
        const test = new Test(testName, testFnWithContext, null, context)
        return test.run()
            .then(() => {
                assert.equal(test.error, null)
            })
    },
}

const TestEvaluateContextFunction = {
    'not-function': {
        'should keep the context as is': () => {
            const context = createContext()
            const test = new Test(testName, testFn, null, context)
            assert.strictEqual(test.context, context)
            return test._evaluateContext()
                .then(() => {
                    assert.strictEqual(test.context, context)
                })
        },
        'should resolve with context object': () => {
            const context = createContext()
            const test = new Test(testName, testFn, null, context)
            assert.strictEqual(test.context, context)
            return test._evaluateContext()
                .then((res) => {
                    assert.strictEqual(test.context, res)
                    assert.strictEqual(res, context)
                })
        },
    },
    'function-async': {
        'should update context after resolving context function': () => {
            const contextFn = function Context() {
                return new Promise(resolve => setTimeout(resolve, 50))
                    .then(() =>
                        Object.assign(this, createContext())
                    )
            }
            const test = new Test(testName, testFn, null, contextFn)
            assert.strictEqual(test.context, contextFn)
            return test._evaluateContext()
                .then(() => {
                    assert.notStrictEqual(test.context, contextFn)
                    assert.deepEqual(test.context, createContext())
                })
        },
        'should resolve with context object': () => {
            const contextFn = function Context() {
                return new Promise(resolve => setTimeout(resolve, 50))
                    .then(() =>
                        Object.assign(this, createContext())
                    )
            }
            const test = new Test(testName, testFn, null, contextFn)
            return test._evaluateContext()
                .then((res) => {
                    assert.strictEqual(test.context, res)
                    assert.notStrictEqual(res, contextFn)
                    assert.deepEqual(res, createContext())
                })
        },
    },
    'func-sync': {
        'should update context after evaluting context function': () => {
            const contextFn = function Context() {
                Object.assign(this, createContext())
            }
            const test = new Test(testName, testFn, null, contextFn)
            assert.strictEqual(test.context, contextFn)
            return test._evaluateContext()
                .then(() => {
                    assert.notStrictEqual(test.context, contextFn)
                    assert.deepEqual(test.context, createContext())
                })
        },
        'should resolve with context object': () => {
            const contextFn = function Context() {
                Object.assign(this, createContext())
            }
            const test = new Test(testName, testFn, null, contextFn)
            assert.strictEqual(test.context, contextFn)
            return test._evaluateContext()
                .then((res) => {
                    assert.strictEqual(test.context, res)
                    assert.notStrictEqual(res, contextFn)
                    assert.deepEqual(res, createContext())
                })
        },
    },
    'func - should return rejected promise if error was thrown': () => {
        const error = new Error('test-init-context-error')
        const contextFn = function Context() {
            throw error
        }
        const test = new Test(testName, testFn, null, contextFn)
        return test._evaluateContext()
            .then(() => {
                throw new Error('_evaluateContext should have been rejected')
            }, (err) => {
                assert.strictEqual(err, error)
            })
    },
}

module.exports = {
    'test suite context': TestSuiteContext,
    'test context': TestContext,
    'test suite context from tests': TestSuiteContextFromTests,
    'test _evaluateContext function': TestEvaluateContextFunction,
}
