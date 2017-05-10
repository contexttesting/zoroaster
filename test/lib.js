const TestSuite = require('../src/test_suite')
const Test = require('../src/test')

/**
 * Assert that the test suite does not contain tests with errors by traversing
 * child tests and test suites.
 * @param {TestSuite} testSuite - test suite
 * @throws Throws if a test had errors in it.
 */
function assertNoErrosInTestSuite(testSuite) {
    testSuite.tests.forEach((test) => {
        if (test instanceof Test) {
            if (test.error) {
                const message = `Error in test "${testSuite.name} > ${test.name}": ${test.error.message}`
                throw new Error(message)
            }
        } else if (test instanceof TestSuite) {
            assertNoErrosInTestSuite(test)
        }
    })
}
module.exports = {
    assertNoErrosInTestSuite,
}
