var assert = require('assert');

var _require = require('path'),
    resolve = _require.resolve;

var TestSuite = require('../../src/test_suite');

var test_suite = require('../fixtures/test_suite');

var testSuiteName = 'Zoroaster Test Suite';
var errorMessage = 'When you are in doubt abstain.';
var TestSuite_test_suite = {
  constructor: {
    'throws an error if no name is given'() {
      try {
        new TestSuite();
        throw new Error('No name error should have been thrown.');
      } catch (err) {
        assert(err.message === 'Test suite name must be given.');
      }
    },

    'throws an error if neither object nor path given'() {
      try {
        new TestSuite(testSuiteName);
        throw new Error('No path or object error should have been thrown.');
      } catch (err) {
        assert(err.message === 'You must provide either a path to a module, or tests in an object.');
      }
    },

    'initialises test suite name'() {
      var testSuite = new TestSuite(testSuiteName, {});
      assert(testSuite.name === testSuiteName);
    },

    'creates a test suite from an object'() {
      var testSuite = new TestSuite(testSuiteName, test_suite);
      assert(testSuite.rawTests === test_suite);
    },

    'creates a test suite from a file'() {
      var test_suite_path = resolve(__dirname, '../fixtures/test_suite');
      var testSuite = new TestSuite(testSuiteName, test_suite_path);
      assert(testSuite.path === test_suite_path);

      testSuite.require();

      assert(testSuite.rawTests === test_suite);
    }

  },
  'should throw an error when test suite could not be required': function shouldThrowAnErrorWhenTestSuiteCouldNotBeRequired() {
    var tsPath = 'noop-path';
    var testSuite = new TestSuite(testSuiteName, tsPath);
    assert(testSuite.path === tsPath);

    try {
      testSuite.require();

      throw new Error('Cannot find module error should have been thrown');
    } catch (err) {
      assert(err.message === 'Cannot find module \'noop-path\'');
    }
  },

  'runs a test suite'() {
    return new Promise(function ($return, $error) {
      var testSuite;
      testSuite = new TestSuite(testSuiteName, {
        test() {},

        test2() {
          return new Promise(function ($return, $error) {
            return $error(new Error('error'));
          }.bind(this));
        },

        test3() {
          return new Promise(function ($return, $error) {
            return $return();
          }.bind(this));
        }

      });
      return Promise.resolve(testSuite.run()).then(function ($await_4) {
        try {
          testSuite.tests.forEach(function (test) {
            assert(test.started);
            assert(test.finished);
          });
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'runs a test suite recursively'() {
    return new Promise(function ($return, $error) {
      var testSuite, test;
      testSuite = new TestSuite(testSuiteName, {
        test_suite: {
          test() {}

        }
      });
      return Promise.resolve(testSuite.run()).then(function ($await_5) {
        try {
          test = testSuite.tests[0].tests[0];
          assert(test.started);
          assert(test.finished);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'creates test suites recursively'() {
    var testSuite = new TestSuite(testSuiteName, {
      test_suite_level_A1: {
        test_suite_level_A1B1: {
          testA1B1() {}

        },
        test_suite_level_A1B2: {
          testA1B2() {}

        }
      },
      test_suite_level_A2: {
        test_suite_level_A2B1: {
          testA2B1() {}

        },
        test_suite_level_A2B2: {
          testA2B2() {}

        }
      }
    });
    assert(testSuite.tests[0].name === 'test_suite_level_A1');
    assert(testSuite.tests[0].tests[0].name === 'test_suite_level_A1B1');
    assert(testSuite.tests[0].tests[0].tests[0].name === 'testA1B1');
    assert(testSuite.tests[0].tests[1].name === 'test_suite_level_A1B2');
    assert(testSuite.tests[0].tests[1].tests[0].name === 'testA1B2');
    assert(testSuite.tests[1].name === 'test_suite_level_A2');
    assert(testSuite.tests[1].tests[0].name === 'test_suite_level_A2B1');
    assert(testSuite.tests[1].tests[0].tests[0].name === 'testA2B1');
    assert(testSuite.tests[1].tests[1].name === 'test_suite_level_A2B2');
    assert(testSuite.tests[1].tests[1].tests[0].name === 'testA2B2');
  },

  'creates a recursive test suite using string'() {
    var test_suite_path = resolve(__dirname, '../fixtures/test_suite');
    var testSuite = new TestSuite(testSuiteName, {
      fixtures_test_suite: test_suite_path
    });
    assert(testSuite.tests[0].name === 'fixtures_test_suite');
    assert(testSuite.tests[0].path === test_suite_path);
    assert(testSuite.tests[0].parent === testSuite);
  },

  'has an error when a test fails'() {
    return new Promise(function ($return, $error) {
      var testSuite;
      testSuite = new TestSuite(testSuiteName, {
        test_does_not_have_error() {},

        test_has_error() {
          throw new Error(errorMessage);
        }

      });
      return Promise.resolve(testSuite.run()).then(function ($await_6) {
        try {
          assert(testSuite.hasErrors);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'has an error when a test suite fails'() {
    return new Promise(function ($return, $error) {
      var testSuite;
      testSuite = new TestSuite(testSuiteName, {
        test_suite_does_not_have_error: {
          test_does_not_have_error() {}

        },
        test_suite_has_error: {
          test_has_error() {
            throw new Error(errorMessage);
          }

        }
      });
      return Promise.resolve(testSuite.run()).then(function ($await_7) {
        try {
          assert(testSuite.hasErrors);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'creates a test with a default timeout'() {
    var testSuite = new TestSuite(testSuiteName, {
      test() {}

    });
    assert(testSuite._tests[0].timeout === 2000);
  }

};
module.exports = TestSuite_test_suite;