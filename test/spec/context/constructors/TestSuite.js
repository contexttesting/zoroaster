import { ok, equal, notStrictEqual, deepEqual, strictEqual } from 'assert'
import TestSuite from '../../../../src/lib/TestSuite'
import Context from '../../../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'creates a test suite with a cloned context'({ context, TEST_SUITE_NAME }) {
    const testSuite = new TestSuite(TEST_SUITE_NAME, {}, null, context)
    notStrictEqual(testSuite.context, context)
    deepEqual(testSuite.context, context)
  },
  'freezes context after creation'({ context, TEST_SUITE_NAME }) {
    const testSuite = new TestSuite(TEST_SUITE_NAME, {}, null, context)
    ok(Object.isFrozen(testSuite.context))
  },
  async 'passes context to child test suites'({ context, TEST_SUITE_NAME, tests: { test } }) {
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      test_suite: {
        test,
      },
    }, null, context)
    await testSuite.run()
    testSuite.tests.forEach((childTestSuite) => {
      ok(childTestSuite instanceof TestSuite)
      equal(childTestSuite.context, testSuite.context)
    })
  },
  async 'passes context to tests'({ context, TEST_SUITE_NAME, tests: { test } }) {
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      test,
    }, null, context)
    await testSuite.run()
    testSuite.tests.forEach((t) => {
      equal(t.context, testSuite.context)
    })
  },
}

export default T

/** @type {Object.<string, (c: Context)>} */
export const from_tests = {
  context: Context,
  'adds context from passed object'({ context, TEST_SUITE_NAME, tests: { test } }) {
    const ts = new TestSuite(TEST_SUITE_NAME, {
      context,
      test,
    })
    notStrictEqual(ts.context, context)
    deepEqual(ts.context, context)
  },
  'freezes passed context'({ context, TEST_SUITE_NAME, tests: { test } }) {
    const c = { ...context }
    ok(!Object.isFrozen(c))
    const ts = new TestSuite(TEST_SUITE_NAME, {
      context: c,
      test,
    })
    ok(Object.isFrozen(ts.context))
  },
  'does not add context as a test'({ context, TEST_SUITE_NAME, tests: { test } }) {
    const tests = {
      context,
      test,
    }
    const ts = new TestSuite(TEST_SUITE_NAME, tests)
    equal(ts.tests.length, 1)
    equal(ts.tests[0].fn, test)
  },
  'extends current context'({ context, extension, totalContext, TEST_SUITE_NAME }) {
    const ts = new TestSuite(TEST_SUITE_NAME, {
      context,
    }, null, extension)
    deepEqual(ts.context, totalContext)
  },
  async 'passes context to tests'({
    context, extension, totalContext, TEST_SUITE_NAME, assertNoErrorsInTestSuite,
  }) {
    const ts = new TestSuite(TEST_SUITE_NAME, {
      context,
      test(c) {
        deepEqual(c, context)
      },
      innerTestSuite: {
        context: extension,
        test(c) {
          deepEqual(c, totalContext)
        },
      },
    })
    await ts.run()
    assertNoErrorsInTestSuite(ts)
  },
  async 'cannot update context from tests'({ context, TEST_SUITE_NAME }) {
    const expected = { ...context }
    const ts = new TestSuite(TEST_SUITE_NAME, {
      context,
      test(c) {
        c.born = 0
        delete c.died
      },
    })
    await ts.run()
    deepEqual(context, expected)
  },
}
