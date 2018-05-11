import TestSuite from '../src/TestSuite'
import Test from '../src/Test'

/**
 * Assert that the test suite does not contain tests with errors by traversing
 * child tests and test suites.
 * @param {TestSuite} testSuite - test suite
 * @throws Throws if a test had errors in it.
 */
export function assertNoErrorsInTestSuite(testSuite) {
  testSuite.tests.forEach((test) => {
    if (test instanceof Test) {
      if (test.error) {
        const message = `Error in test "${testSuite.name} > ${test.name}": ${test.error.message}`
        throw new Error(message)
      }
    } else if (test instanceof TestSuite) {
      assertNoErrorsInTestSuite(test)
    }
  })
}
