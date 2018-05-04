var TestSuite = require('../src/test_suite');

var Test = require('../src/test');
/**
 * Assert that the test suite does not contain tests with errors by traversing
 * child tests and test suites.
 * @param {TestSuite} testSuite - test suite
 * @throws Throws if a test had errors in it.
 */


function assertNoErrorsInTestSuite(testSuite) {
  testSuite.tests.forEach(function (test) {
    if (test instanceof Test) {
      if (test.error) {
        var message = `Error in test "${testSuite.name} > ${test.name}": ${test.error.message}`;
        throw new Error(message);
      }
    } else if (test instanceof TestSuite) {
      assertNoErrorsInTestSuite(test);
    }
  });
}

module.exports = {
  assertNoErrorsInTestSuite
};