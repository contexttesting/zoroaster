import { ok, equal, throws, notStrictEqual, deepEqual } from 'assert'
import TestSuite from '../../../../src/lib/TestSuite'
import context, { Context } from '../../../context' // eslint-disable-line no-unused-vars

/** @type {Object.<string, (ctx: Context)>} */
const t = {
  context,
  'throws an error when context passed is not an object'({ TEST_SUITE_NAME }) {
    throws(
      () => new TestSuite(TEST_SUITE_NAME, {}, null, 'context'),
      /Context must be an object./
    )
  },
  'throws an error when context passed is null'({ TEST_SUITE_NAME }) {
    throws(
      () => new TestSuite(TEST_SUITE_NAME, {}, null, null),
      /Context cannot be null./
    )
  },
  'creates a test suite with a cloned context'({ createObjectContext, TEST_SUITE_NAME }) {
    const context = createObjectContext()
    const testSuite = new TestSuite(TEST_SUITE_NAME, {}, null, context)
    notStrictEqual(testSuite.context, context)
    deepEqual(testSuite.context, context)
  },
  'freezes context after creation'({ createObjectContext, TEST_SUITE_NAME }) {
    const context = createObjectContext()
    const testSuite = new TestSuite(TEST_SUITE_NAME, {}, null, context)
    ok(Object.isFrozen(testSuite.context))
  },
  async 'passes context to child test suites'({ createObjectContext, TEST_SUITE_NAME }) {
    const context = createObjectContext()
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      test_suite: {
        test() {},
      },
    }, null, context)
    await testSuite.run()
    testSuite.tests.forEach((childTestSuite) => {
      ok(childTestSuite instanceof TestSuite)
      equal(childTestSuite.context, testSuite.context)
    })
  },
  async 'passes context to tests'({ createObjectContext, TEST_SUITE_NAME }) {
    const context = createObjectContext()
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      test: () => { },
    }, null, context)
    await testSuite.run()
    testSuite.tests.forEach((test) => {
      equal(test.context, testSuite.context)
    })
  },
}

export default t

/** @type {Object.<string, (ctx: Context)>} */
export const from_tests = {
  context,
  'throws an error when context passed is not an object'({ TEST_SUITE_NAME }) {
    throws(
      () => new TestSuite(TEST_SUITE_NAME, { context: 'context' }),
      /Context must be an object./
    )
  },
  'throws an error when context passed is null'({ TEST_SUITE_NAME }) {
    throws(
      () => new TestSuite(TEST_SUITE_NAME, { context: null }),
      /Context cannot be null./
    )
  },
  'adds context from passed object'({ createObjectContext, TEST_SUITE_NAME }) {
    const context = createObjectContext()
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      context,
      test() { },
    })
    notStrictEqual(testSuite.context, context)
    deepEqual(testSuite.context, context)
  },
  'freezes passed context'({ createObjectContext, TEST_SUITE_NAME }) {
    const context = createObjectContext()
    ok(!Object.isFrozen(context))
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      context,
      test() { },
    })
    ok(Object.isFrozen(testSuite.context))
  },
  'does not add context as a test'({ createObjectContext, TEST_SUITE_NAME }) {
    const test = () => { }
    const tests = {
      test,
      context: createObjectContext(),
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, tests)
    equal(testSuite.tests.length, 1)
    equal(testSuite.tests[0].fn, test)
  },
  'extends current context'({
    createObjectContext, createObjectContext2, TEST_SUITE_NAME,
  }) {
    const context = createObjectContext()
    const existingContext = createObjectContext2()
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      context,
      test() { },
    }, null, existingContext)
    const expected = { ...existingContext, ...context }
    deepEqual(testSuite.context, expected)
  },
  async 'passes context to tests'({
    createObjectContext, createObjectContext2, TEST_SUITE_NAME, assertNoErrorsInTestSuite,
  }) {
    const context = createObjectContext()
    const existingContext = createObjectContext2()
    const totalContext = { ...existingContext, ...context }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      context,
      test(ctx) {
        deepEqual(ctx, context)
      },
      innerTestSuite: {
        context: existingContext,
        test(ctx) {
          deepEqual(ctx, totalContext)
        },
      },
    })
    await testSuite.run()
    assertNoErrorsInTestSuite(testSuite)
  },
  async 'cannot update context from tests'({ createObjectContext, TEST_SUITE_NAME }) {
    const context = createObjectContext()
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      context,
      test(ctx) {
        ctx.born = 0
      },
    })
    await testSuite.run()
    const expected = createObjectContext()
    deepEqual(context, expected)
  },
}
