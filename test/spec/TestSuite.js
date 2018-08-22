import { ok, equal } from 'assert'
import throws from 'assert-throws'
import TestSuite from '../../src/lib/TestSuite'
import Context from '../context'

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
  'throws an error if neither object nor path given'({ TEST_SUITE_NAME }) {
    try {
      new TestSuite(TEST_SUITE_NAME)
      throw new Error('No path or object error should have been thrown.')
    } catch ({ message }) {
      equal(message, 'You must provide either a path to a module, or tests in an object.')
    }
  },
  'initialises test suite name'({ TEST_SUITE_NAME }) {
    const ts = new TestSuite(TEST_SUITE_NAME, {})
    equal(ts.name, TEST_SUITE_NAME)
  },
  'creates a test suite from an object'({ TEST_SUITE_NAME, testSuite }) {
    const ts = new TestSuite(TEST_SUITE_NAME, testSuite)
    equal(ts.rawTests, testSuite)
  },
  'creates a test suite from a file'({ TEST_SUITE_NAME, testSuite, TEST_SUITE_PATH }) {
    const ts = new TestSuite(TEST_SUITE_NAME, TEST_SUITE_PATH)
    equal(ts.path, TEST_SUITE_PATH)
    ts.require()
    equal(ts.rawTests, testSuite)
  },
  'throws an error when test suite could not be required'({ TEST_SUITE_NAME }) {
    const tsPath = 'noop-path'
    const testSuite = new TestSuite(TEST_SUITE_NAME, tsPath)
    equal(testSuite.path, tsPath)
    try {
      testSuite.require()
      throw new Error('Cannot find module error should have been thrown')
    } catch ({ message }) {
      equal(message, 'Cannot find module \'noop-path\'')
    }
  },
  async 'runs a test suite'({ TEST_SUITE_NAME, tests, assertTestsRun }) {
    const ts = new TestSuite(TEST_SUITE_NAME, {
      ...tests,
    })
    await ts.run()
    assertTestsRun(ts)
  },
  async 'runs a test suite recursively'({ TEST_SUITE_NAME, tests, assertTestsRun }) {
    const ts = new TestSuite(TEST_SUITE_NAME, {
      test_suite: {
        ...tests,
      },
    })
    await ts.run()
    assertTestsRun(ts)
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
  'creates a recursive test suite using string'({ TEST_SUITE_NAME, TEST_SUITE_PATH }) {
    const ts = new TestSuite(TEST_SUITE_NAME, {
      fixtures_test_suite: TEST_SUITE_PATH,
    })
    const { tests: [{ name, path, parent }] } = ts
    equal(name, 'fixtures_test_suite')
    equal(path, TEST_SUITE_PATH)
    equal(parent, ts)
  },
  async 'has an error when a test fails'({ TEST_SUITE_NAME, tests: { test, failingTest } }) {
    const ts = new TestSuite(TEST_SUITE_NAME, {
      test,
      failingTest,
    })
    await ts.run()
    ok(ts.hasErrors)
  },
  async 'has an error when a test suite fails'({ TEST_SUITE_NAME, tests: { test, failingTest } }) {
    const ts = new TestSuite(TEST_SUITE_NAME, {
      test_suite_does_not_have_error: {
        test,
      },
      test_suite_has_error: {
        failingTest,
      },
    })
    await ts.run()
    ok(ts.hasErrors)
  },
  'creates a test with a default timeout'({ TEST_SUITE_NAME, tests: { test } }) {
    const ts = new TestSuite(TEST_SUITE_NAME, {
      test,
    })
    equal(ts._tests[0].timeout, 2000)
  },
}

export default T
