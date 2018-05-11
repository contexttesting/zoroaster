import TestSuite from '../../src/lib/TestSuite'
import Test from '../../src/lib/Test'
import erotic from 'erotic'

/**
 * Assert that the test suite does not contain tests with errors by traversing
 * child tests and test suites.
 * @param {TestSuite} testSuite instance of a TestSuite
 * @throws Throws if a test had errors in it.
 */
function assertNoErrorsInTestSuite(testSuite, e = erotic()) {
  testSuite.tests.forEach((test) => {
    if (test instanceof Test) {
      if (test.error) {
        const message = `Error in test "${testSuite.name} > ${test.name}": ${test.error.message}`
        const er = e(message)
        throw er
      }
    } else if (test instanceof TestSuite) {
      assertNoErrorsInTestSuite(test, e)
    }
  })
}

const TEST_SUITE_NAME = 'Zoroaster Test Suite Name'
const TEST_NAME = 'Zoroaster Test Name'

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

const test = () => {}

export default function context() {
  Object.assign(this, {
    test,
    TEST_NAME,
    TEST_SUITE_NAME,
    createObjectContext,
    createObjectContext2,
    assertNoErrorsInTestSuite,
  })
}


/**
 * @typedef {Object} Context
 * @property {string} TEST_SUITE_NAME Name of the test suite.
 * @property {string} TEST_NAME Name of the test suite.
 * @property {test} test
 * @property {assertNoErrorsInTestSuite} assertNoErrorsInTestSuite
 * @property {createObjectContext} createObjectContext
 * @property {createObjectContext2} createObjectContext2
 */


/**
 * @type {Context}
 */
const Context = {}

export { Context }
