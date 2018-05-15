import { ok } from 'assert'
import erotic from 'erotic'
import { resolve } from 'path'
import TestSuite from '../../src/lib/TestSuite'
import Test from '../../src/lib/Test'
import * as _tests from '../fixtures/tests'
import testSuite from '../fixtures/test_suite'

const { TEST_ERROR_MESSAGE, TEST_RETURN_MESSAGE, ...tests } = _tests

const getErrMessage = (testSuiteName, { name, error }) => {
  const message = `Error in test "${testSuiteName} > ${name}": ${error.message}`
  return message
}

/**
 * Assert that the test suite does not contain tests with errors by traversing
 * child tests and test suites.
 * @param {TestSuite} testSuite instance of a TestSuite
 * @throws Throws if a test had errors in it.
 */
function assertNoErrorsInTestSuite({ name, tests: t }, e = erotic(true)) {
  t.forEach((test) => {
    if (test instanceof Test) {
      if (test.error) {
        const message = getErrMessage(name, test) //  `Error in test "${testSuite.name} > ${test.name}": ${test.error.message}`
        const er = e(message)
        throw er
      }
    } else if (test instanceof TestSuite) {
      assertNoErrorsInTestSuite(test, e)
    } else {
      throw e('test is not a test or a test suite') // test the tests
    }
  })
}

const TEST_SUITE_NAME = 'Zoroaster Test Suite Name'
const TEST_NAME = 'Zoroaster Test Name'

/**
 * Path to an exported test suite file fixture.
 */
const TEST_SUITE_PATH = resolve(__dirname, '../fixtures/test_suite.js')

/**
 * Create a simple context object with some properties.
 */
function createObjectContext() {
  return {
    name: 'Zarathustra',
    country: 'Iran',
    born: -628,
    died: -551,
  }
}

/**
 * Create a simple context object with some properties different from those generated with createObjectContext.
 */
function createObjectContext2() {
  return {
    phenomena: ['act', 'speech', 'thought'],
    Činvat: 'Bridge of the Requiter',
    humans: () => 'Responsibility for fate',
  }
}


export default function context() {
  Object.assign(this, {
    tests,
    testSuite,
    TEST_NAME,
    TEST_SUITE_NAME,
    createObjectContext,
    createObjectContext2,
    assertNoErrorsInTestSuite,
    assertTestsRun,
    TEST_SUITE_PATH,
    TEST_ERROR_MESSAGE,
    TEST_RETURN_MESSAGE,
  })
}

/**
 * @param {TestSuite} ts A test suite.
 */
const assertTestsRun = (ts, e = erotic(true)) => {
  const { name, tests: t } = ts
  t.forEach((test) => {
    if (test instanceof Test) {
      const { started, finished, name: testName } = test
      if (process.env.DEBUG) console.log('assert %s run', testName) // eslint-disable-line
      try {
        ok(started)
        ok(finished)
      } catch (err) {
        throw e(err)
      }
    } else if (test instanceof TestSuite) {
      assertTestsRun(test, e)
    } else {
      throw e('test is not a test or a test suite') // test the tests
    }
  })
}

/**
 * @typedef {Object} Context
 * @property {string} TEST_SUITE_NAME Name of the test suite.
 * @property {string} TEST_NAME Name of the test suite.
 * @property {TEST_SUITE} TEST_SUITE A full test suite
 * @property {tests} tests
 * @property {assertNoErrorsInTestSuite} assertNoErrorsInTestSuite
 * @property {assertTestsRun} assertTestsRun Assert that all tests in the test suite were run. // test this
 * @property {createObjectContext} createObjectContext
 * @property {createObjectContext2} createObjectContext2
 * @property {TEST_SUITE_PATH} TEST_SUITE_PATH Path to the test suite file, i.e. fixtures/test_suite.js
 * @property {TEST_ERROR_MESSAGE} TEST_ERROR_MESSAGE Expected error message in the failing test
 * @property {TEST_RETURN_MESSAGE} TEST_RETURN_MESSAGE Message returned by a test
 */


/**
 * @type {Context}
 */
const Context = {}

export { Context }
