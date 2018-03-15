const assert = require('assert')
const throws = require('assert-throws')
const TestSuite = require('../../src/test_suite')
const Test = require('../../src/test')
const { assertNoErrosInTestSuite } = require('../lib')

const testSuiteName = 'Zoroaster Context Test Suite'
const testName = 'Zoroaster Context Test'
const testFn = () => { }

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
  'throws an error when context passed is not an object'() {
    assert.throws(
      () => new TestSuite(testSuiteName, {}, null, 'context'),
      /Context must be an object./
    )
  },
  'throws an error when context passed is null'() {
    assert.throws(
      () => new TestSuite(testSuiteName, {}, null, null),
      /Context cannot be null./
    )
  },
  'creates a test suite with a cloned context'() {
    const context = createContext()
    const testSuite = new TestSuite(testSuiteName, {}, null, context)
    assert.notStrictEqual(testSuite.context, context)
    assert.deepEqual(testSuite.context, context)
  },
  'freezes context after creation'() {
    const context = createContext()
    const testSuite = new TestSuite(testSuiteName, {}, null, context)
    assert(Object.isFrozen(testSuite.context))
  },
  async 'passes context to child test suites'() {
    const context = createContext()
    const testSuite = new TestSuite(testSuiteName, {
      test_suite: {
        test: () => { },
      },
    }, null, context)
    await testSuite.run()
    testSuite.tests.forEach((childTestSuite) => {
      assert(childTestSuite instanceof TestSuite)
      assert.equal(childTestSuite.context, testSuite.context)
    })
  },
  async 'passes context to tests'() {
    const context = createContext()
    const testSuite = new TestSuite(testSuiteName, {
      test: () => { },
    }, null, context)
    await testSuite.run()
    testSuite.tests.forEach((test) => {
      assert.equal(test.context, testSuite.context)
    })
  },
}

const TestSuiteContextFromTests = {
  'throws an error when context passed is not an object'() {
    assert.throws(
      () => new TestSuite(testSuiteName, { context: 'context' }),
      /Context must be an object./
    )
  },
  'throws an error when context passed is null'() {
    assert.throws(
      () => new TestSuite(testSuiteName, { context: null }),
      /Context cannot be null./
    )
  },
  'adds context from passed object'() {
    const context = createContext()
    const testSuite = new TestSuite(testSuiteName, {
      context,
      test() { },
    })
    assert.notStrictEqual(testSuite.context, context)
    assert.deepEqual(testSuite.context, context)
  },
  'freezes passed context'() {
    const context = createContext()
    assert(!Object.isFrozen(context))
    const testSuite = new TestSuite(testSuiteName, {
      context,
      test() { },
    })
    assert(Object.isFrozen(testSuite.context))
  },
  'does not add context as a test'() {
    const test = () => { }
    const tests = {
      test,
      context: createContext(),
    }
    const testSuite = new TestSuite(testSuiteName, tests)
    assert.equal(testSuite.tests.length, 1)
    assert.equal(testSuite.tests[0].fn, test)
  },
  'extends current context'() {
    const existingContext = getExistingContext()
    const context = createContext()
    const testSuite = new TestSuite(testSuiteName, {
      context,
      test() { },
    }, null, existingContext)
    const expected = Object.assign({}, existingContext, context)
    assert.deepEqual(testSuite.context, expected)
  },
  async 'passes context to tests'() {
    const context = createContext()
    const existingContext = getExistingContext()
    const totalContext = { ...existingContext, ...context }
    const testSuite = new TestSuite(testSuiteName, {
      context,
      test(ctx) {
        assert.deepEqual(ctx, context)
      },
      innerTestSuite: {
        context: existingContext,
        test(ctx) {
          assert.deepEqual(ctx, totalContext)
        },
      },
    })
    await testSuite.run()
    assertNoErrosInTestSuite(testSuite)
  },
  async 'cannot update context from tests'() {
    const context = createContext()
    const testSuite = new TestSuite(testSuiteName, {
      context,
      test(ctx) {
        ctx.born = 0
      },
    })
    await testSuite.run()
    assert.deepEqual(context, createContext())
  },
}

const TestContext = {
  'throws an error when context passed is not an object'() {
    assert.throws(
      () => new Test(testName, testFn, null, 'context'),
      /Context must be an object./
    )
  },
  'throws an error when context passed is null'() {
    assert.throws(
      () => new Test(testName, testFn, null, null),
      /Context cannot be null./
    )
  },
  'creates a test with a context'() {
    const context = createContext()
    const test = new Test(testName, testFn, null, context)
    assert.strictEqual(test.context, context)
  },
  async 'passes context as first argument to function'() {
    const context = createContext()
    const testFnWithContext = (ctx) => {
      assert.equal(ctx, context)
    }
    const test = new Test(testName, testFnWithContext, null, context)
    await test.run()
    assert.equal(test.error, null)
  },
}

const TestEvaluateContextFunction = {
  async 'keeps the context as is for objects'() {
    const context = createContext()
    const test = new Test(testName, testFn, null, context)
    assert.strictEqual(test.context, context)
    await test._evaluateContext()
    assert.strictEqual(test.context, context)
  },
  async 'updates context after resolving async context function'() {
    const context = createContext()
    async function Context() {
      await new Promise(resolve => setTimeout(resolve, 50))
      Object.assign(this, context)
    }
    const test = new Test(testName, testFn, null, Context)
    assert.strictEqual(test.context, Context)
    await test._evaluateContext()
    assert.notStrictEqual(test.context, Context)
    assert.deepEqual(test.context, context)
  },
  async 'updates context after evaluting sync context function'() {
    const context = createContext()
    function Context() {
      Object.assign(this, context)
    }
    const test = new Test(testName, testFn, null, Context)
    assert.strictEqual(test.context, Context)
    await test._evaluateContext()
    assert.notStrictEqual(test.context, Context)
    assert.deepEqual(test.context, context)
  },
  async 'fails the test if evaluation failed'() {
    const error = new Error('test-init-context-error')
    function Context() {
      throw error
    }
    const test = new Test(testName, testFn, null, Context)
    await throws({
      async fn() { await test._evaluateContext() },
      error,
    })
  },
}

module.exports = {
  'test suite context': TestSuiteContext,
  'test context': TestContext,
  'test suite context from tests': TestSuiteContextFromTests,
  'test _evaluateContext function': TestEvaluateContextFunction,
}
