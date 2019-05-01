import { ok, equal, deepEqual } from 'assert'
import throws from 'assert-throws'
import TestSuite from '../../../src/lib/TestSuite'
import Context from '../../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'throws an error if no name is given'() {
    await throws({
      fn() {
        new TestSuite()
      },
      message: 'Test suite name must be given.',
    })
  },
  async 'throws an error if neither object nor path given'({ TEST_SUITE_NAME }) {
    await throws({
      async fn() {
        new TestSuite(TEST_SUITE_NAME)
      },
      message: 'You must provide tests in an object.',
    })
  },
  'initialises test suite name'({ TEST_SUITE_NAME }) {
    const ts = new TestSuite(TEST_SUITE_NAME, {})
    equal(ts.name, TEST_SUITE_NAME)
  },
  'creates a test suite from an object'({ TEST_SUITE_NAME, tests }) {
    const ts = new TestSuite(TEST_SUITE_NAME, tests)
    deepEqual(ts.rawTests, tests)
  },
  async 'runs a test suite'({ TEST_SUITE_NAME, testSuite, runTestSuite, clearNots }) {
    const ts = new TestSuite(TEST_SUITE_NAME, testSuite)
    const nots = await runTestSuite(ts, false)
    return clearNots(nots)
  },
  async 'runs a test suite recursively'({ TEST_SUITE_NAME, testSuite, runTestSuite, clearNots }) {
    const ts = new TestSuite(TEST_SUITE_NAME, {
      test_suite: testSuite,
    })
    const nots = await runTestSuite(ts, false)
    return clearNots(nots)
  },
  'creates test suites recursively'({ TEST_SUITE_NAME }) {
    const { tests } = new TestSuite(TEST_SUITE_NAME, {
      test_suite_level_A1: {
        test_suite_level_A1B1: {
          testA1B1() { },
        },
        test_suite_level_A1B2: {
          testA1B2() { },
        },
      },
      test_suite_level_A2: {
        test_suite_level_A2B1: {
          testA2B1() { },
        },
        test_suite_level_A2B2: {
          testA2B2() { },
        },
      },
    })
    const [tests0, tests1] = tests
    equal(tests0.name, 'test_suite_level_A1')
    equal(tests0.tests[0].name, 'test_suite_level_A1B1')
    equal(tests0.tests[0].tests[0].name, 'testA1B1')
    equal(tests0.tests[1].name, 'test_suite_level_A1B2')
    equal(tests0.tests[1].tests[0].name, 'testA1B2')

    equal(tests1.name, 'test_suite_level_A2')
    equal(tests1.tests[0].name, 'test_suite_level_A2B1')
    equal(tests1.tests[0].tests[0].name, 'testA2B1')
    equal(tests1.tests[1].name, 'test_suite_level_A2B2')
    equal(tests1.tests[1].tests[0].name, 'testA2B2')
  },
  async 'has an error when a test fails'({ TEST_SUITE_NAME, tests: { test, failingTest }, runTestSuite }) {
    const ts = new TestSuite(TEST_SUITE_NAME, {
      test,
      failingTest,
    })
    await throws({
      fn: runTestSuite,
      args: ts,
      code: 'TEST_HAS_ERROR',
      message: /When you are in doubt/,
    })
  },
  async 'has an error when a test suite fails'({ TEST_SUITE_NAME, tests: { test, failingTest }, runTestSuite }) {
    const ts = new TestSuite(TEST_SUITE_NAME, {
      test_suite_does_not_have_error: {
        test,
      },
      test_suite_has_error: {
        failingTest,
      },
    })
    await throws({
      fn: runTestSuite,
      args: ts,
      code: 'TEST_HAS_ERROR',
      message: /When you are in doubt/,
    })
  },
  'creates a test with a default timeout'({ TEST_SUITE_NAME, tests: { test } }) {
    const ts = new TestSuite(TEST_SUITE_NAME, {
      test,
    })
    equal(ts._tests[0].timeout, 2000)
  },
}

export default T
