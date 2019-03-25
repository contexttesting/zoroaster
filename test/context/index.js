import { ok } from 'assert'
import erotic from 'erotic'
import TestSuite from '../../src/lib/TestSuite'
import Test from '../../src/lib/Test'
import * as _tests from '../fixtures/tests'
import testSuite from '../fixtures/test-suite'
import { runTestSuiteAndNotify } from '../../src/lib/run-test'

const { TEST_ERROR_MESSAGE, TEST_RETURN_MESSAGE, ...tests } = _tests

const getErrMessage = (testSuiteName, { name, error }) => {
  const message = `Error in test "${testSuiteName} > ${name}": ${error.message}`
  return message
}

const context = Object.freeze({
  name: 'Zarathustra',
  country: 'Iran',
  born: -628,
  died: -551,
})

const extension = Object.freeze({
  phenomena: ['act', 'speech', 'thought'],
  Činvat: 'Bridge of the Requiter',
  humans: () => 'Responsibility for fate',
})
const totalContext = Object.freeze({
  ...context,
  ...extension,
})

const to = async (n = 50) => {
  await new Promise(r => setTimeout(r, n))
}

const ZOROASTER = process.env.ALAMODE_ENV == 'test-build' ? 'build/bin/zoroaster' : 'src/bin'

const re = new RegExp(process.cwd().replace(/\\/g, '\\\\'), 'g')
const winRe = new RegExp(process.cwd().replace(/\\/g, '/'), 'g')

function getSnapshot(s) {
  return s
    .replace(re, '')
    .replace(winRe, '')
    .replace(/\\/g, '/')
    .replace(/\r?\n/g, '\n')
}

const C = {
  /**
   * Return a normalised snapshot that can be tested both on Win and Linux.
   */
  getSnapshot,
  /**
   * Assert that all tests have completed by recursively traversing the test suite.
   * @param {TestSuite} ts A test suite.
   */
  assertTestsRun: (ts, e = erotic(true)) => {
    const { name, tests: t } = ts
    t.forEach((test) => {
      if (test instanceof Test) {
        const { started, finished, name: testName } = test
        if (process.env.DEBUG) console.log('assert %s > %s run', name, testName) // eslint-disable-line
        try {
          ok(started)
          ok(finished)
        } catch (err) {
          throw e(err)
        }
      } else if (test instanceof TestSuite) {
        C.assertTestsRun(test, e)
      } else {
        throw e('test is not a test or a test suite') // test the tests
      }
    })
  },

  /**
   * Assert that the test suite does not contain tests with errors by traversing child tests and test suites.
   * @param {TestSuite} ts instance of a TestSuite
   * @throws Throws if a test had errors in it.
   */
  assertNoErrorsInTestSuite(ts, e = erotic(true)) {
    const { name, tests: t } = ts
    t.forEach((test) => {
      if (test instanceof Test) {
        if (test.error) {
          const message = getErrMessage(name, test)
          const er = e(message)
          throw er
        }
      } else if (test instanceof TestSuite) {
        C.assertNoErrorsInTestSuite(test, e)
      } else {
        throw e('test is not a test or a test suite') // test the tests
      }
    })
  },
  /**
   * Checks that the notifications do not contain errors.
   */
  assertNoNotifyErrors(notifications) {
    notifications.forEach(({ error }) => {
      try { ok(!error) } catch (err) {
        error.message = `A test container error in notification: ${error.message}\n${error.stack.replace(/^[\s\S]+?\n/, '')}`
        throw error
      }
    })
  },

  makeNotify() {
    const notifications = []
    return {
      notifications,
      notify(r) {
        notifications.push(r)
      },
    }
  },

  /**
   * Runs the test suite using the lib's `runTestSuiteAndNotify`.
   */
  async runTestSuite(ts, assertNoErrors = true, onlyFocused) {
    const e = erotic(true)
    try {
      const { notifications, notify } = this.makeNotify()
      await runTestSuiteAndNotify(notify, [], '', [], ts, onlyFocused)
      if (assertNoErrors) this.assertNoNotifyErrors(notifications)
      return notifications
    } catch (err) {
      const er = e(err)
      throw er
    }
  },

  /**
   * Create a simple context object with some properties.
   */
  createObjectContext() {
    console.log('deprecated')
    return C.context
  },

  /**
   * A context object.
   */
  context,
  /**
   * An extension to the context object.
   */
  extension,

  /**
   * A context together with extension.
   */
  totalContext,

  /**
   * Create a simple context object with some properties different from those generated with createObjectContext.
   */
  createObjectContext2() {
    console.log('deprecated')
    return C.extension
  },

  /**
   * Asynchronous function to wait for certain time. Default 50 ms
   */
  to,

  /**
   * Name of the test suite.
   */
  TEST_SUITE_NAME: 'Zoroaster Test Suite Name',

  /**
   * Tests in the fixture test suite.
   */
  tests,

  /**
   * Test suite object from the fixture.
   */
  testSuite,

  /**
   * A test name.
   */
  TEST_NAME: 'Zoroaster Test Name',

  /**
   * Path to an test suite file fixture, i.e. fixtures/test-suite.js.
   */
  TEST_SUITE_PATH: 'test/fixtures/test-suite.js',

  /**
   * Expected error message in the failing test.
   */
  TEST_ERROR_MESSAGE,

  /**
   * Expected message returned by a test.
   */
  TEST_RETURN_MESSAGE,

  /** Run a test from a test suite. */
  runTest,
  BIN: ZOROASTER,
}

/**
 * Initialise contexts for a test and run it.
 * @param {TestSuite} ts A test suite to run.
 * @param {string} name Name of the test in the test suite.
 */
async function runTest(ts, name) {
  if (!(name in ts)) throw new Error('No such test found')

  const contexts = Array.isArray(ts.context) ?
    ts.context : [ts.context].filter(c => c)

  const ic = await contexts.reduce(async (acc, Con) => {
    await acc
    const c = typeof Con == 'object' ? Con : new Con()
    if ('_init' in c) await c._init()
    return [...acc, c]
  }, [])
  const test = ts[name]
  await test(...ic)
}

C.runTestSuite = C.runTestSuite.bind(C)

export default C