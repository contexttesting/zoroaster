function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var assert = require('assert');

var throws = require("assert-throws/es5");

var TestSuite = require('../../src/test_suite');

var Test = require('../../src/test');

var _require = require('../lib'),
    assertNoErrosInTestSuite = _require.assertNoErrosInTestSuite;

var testSuiteName = 'Zoroaster Context Test Suite';
var testName = 'Zoroaster Context Test';

var testFn = function testFn() {};

function createContext() {
  return {
    name: 'Zarathustra',
    country: 'Iran',
    born: -628,
    died: -551
  };
}

function getExistingContext() {
  return {
    phenomena: ['act', 'speech', 'thought'],
    Činvat: 'Bridge of the Requiter',
    humans: function humans() {
      return 'Responsibility for fate';
    }
  };
}

var TestSuiteContext = {
  'throws an error when context passed is not an object'() {
    assert.throws(function () {
      return new TestSuite(testSuiteName, {}, null, 'context');
    }, /Context must be an object./);
  },

  'throws an error when context passed is null'() {
    assert.throws(function () {
      return new TestSuite(testSuiteName, {}, null, null);
    }, /Context cannot be null./);
  },

  'creates a test suite with a cloned context'() {
    var context = createContext();
    var testSuite = new TestSuite(testSuiteName, {}, null, context);
    assert.notStrictEqual(testSuite.context, context);
    assert.deepEqual(testSuite.context, context);
  },

  'freezes context after creation'() {
    var context = createContext();
    var testSuite = new TestSuite(testSuiteName, {}, null, context);
    assert(Object.isFrozen(testSuite.context));
  },

  'passes context to child test suites'() {
    return new Promise(function ($return, $error) {
      var context, testSuite;
      context = createContext();
      testSuite = new TestSuite(testSuiteName, {
        test_suite: {
          test: function test() {}
        }
      }, null, context);
      return Promise.resolve(testSuite.run()).then(function ($await_1) {
        try {
          testSuite.tests.forEach(function (childTestSuite) {
            assert(childTestSuite instanceof TestSuite);
            assert.equal(childTestSuite.context, testSuite.context);
          });
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'passes context to tests'() {
    return new Promise(function ($return, $error) {
      var context, testSuite;
      context = createContext();
      testSuite = new TestSuite(testSuiteName, {
        test: function test() {}
      }, null, context);
      return Promise.resolve(testSuite.run()).then(function ($await_2) {
        try {
          testSuite.tests.forEach(function (test) {
            assert.equal(test.context, testSuite.context);
          });
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

};
var TestSuiteContextFromTests = {
  'throws an error when context passed is not an object'() {
    assert.throws(function () {
      return new TestSuite(testSuiteName, {
        context: 'context'
      });
    }, /Context must be an object./);
  },

  'throws an error when context passed is null'() {
    assert.throws(function () {
      return new TestSuite(testSuiteName, {
        context: null
      });
    }, /Context cannot be null./);
  },

  'adds context from passed object'() {
    var context = createContext();
    var testSuite = new TestSuite(testSuiteName, {
      context,

      test() {}

    });
    assert.notStrictEqual(testSuite.context, context);
    assert.deepEqual(testSuite.context, context);
  },

  'freezes passed context'() {
    var context = createContext();
    assert(!Object.isFrozen(context));
    var testSuite = new TestSuite(testSuiteName, {
      context,

      test() {}

    });
    assert(Object.isFrozen(testSuite.context));
  },

  'does not add context as a test'() {
    var test = function test() {};

    var tests = {
      test,
      context: createContext()
    };
    var testSuite = new TestSuite(testSuiteName, tests);
    assert.equal(testSuite.tests.length, 1);
    assert.equal(testSuite.tests[0].fn, test);
  },

  'extends current context'() {
    var existingContext = getExistingContext();
    var context = createContext();
    var testSuite = new TestSuite(testSuiteName, {
      context,

      test() {}

    }, null, existingContext);
    var expected = Object.assign({}, existingContext, context);
    assert.deepEqual(testSuite.context, expected);
  },

  'passes context to tests'() {
    return new Promise(function ($return, $error) {
      var context, existingContext, totalContext, testSuite;
      context = createContext();
      existingContext = getExistingContext();
      totalContext = _extends({}, existingContext, context);
      testSuite = new TestSuite(testSuiteName, {
        context,

        test(ctx) {
          assert.deepEqual(ctx, context);
        },

        innerTestSuite: {
          context: existingContext,

          test(ctx) {
            assert.deepEqual(ctx, totalContext);
          }

        }
      });
      return Promise.resolve(testSuite.run()).then(function ($await_3) {
        try {
          assertNoErrosInTestSuite(testSuite);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'cannot update context from tests'() {
    return new Promise(function ($return, $error) {
      var context, testSuite;
      context = createContext();
      testSuite = new TestSuite(testSuiteName, {
        context,

        test(ctx) {
          ctx.born = 0;
        }

      });
      return Promise.resolve(testSuite.run()).then(function ($await_4) {
        try {
          assert.deepEqual(context, createContext());
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

};
var TestContext = {
  'throws an error when context passed is not an object'() {
    assert.throws(function () {
      return new Test(testName, testFn, null, 'context');
    }, /Context must be an object./);
  },

  'throws an error when context passed is null'() {
    assert.throws(function () {
      return new Test(testName, testFn, null, null);
    }, /Context cannot be null./);
  },

  'creates a test with a context'() {
    var context = createContext();
    var test = new Test(testName, testFn, null, context);
    assert.strictEqual(test.context, context);
  },

  'passes context as first argument to function'() {
    return new Promise(function ($return, $error) {
      var context, testFnWithContext, test;
      context = createContext();

      testFnWithContext = function testFnWithContext(ctx) {
        assert.equal(ctx, context);
      };

      test = new Test(testName, testFnWithContext, null, context);
      return Promise.resolve(test.run()).then(function ($await_5) {
        try {
          assert.equal(test.error, null);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

};
var TestEvaluateContextFunction = {
  'keeps the context as is for objects'() {
    return new Promise(function ($return, $error) {
      var context, test;
      context = createContext();
      test = new Test(testName, testFn, null, context);
      assert.strictEqual(test.context, context);
      return Promise.resolve(test._evaluateContext()).then(function ($await_6) {
        try {
          assert.strictEqual(test.context, context);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'updates context after resolving async context function'() {
    return new Promise(function ($return, $error) {
      var context, test;

      function Context() {
        return new Promise(function ($return, $error) {
          return Promise.resolve(new Promise(function (resolve) {
            return setTimeout(resolve, 50);
          })).then(function ($await_7) {
            try {
              Object.assign(this, context);
              return $return();
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this), $error);
        }.bind(this));
      }

      context = createContext();
      test = new Test(testName, testFn, null, Context);
      assert.strictEqual(test.context, Context);
      return Promise.resolve(test._evaluateContext()).then(function ($await_8) {
        try {
          assert.notStrictEqual(test.context, Context);
          assert.deepEqual(test.context, context);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'updates context after evaluting sync context function'() {
    return new Promise(function ($return, $error) {
      var context, test;

      function Context() {
        Object.assign(this, context);
      }

      context = createContext();
      test = new Test(testName, testFn, null, Context);
      assert.strictEqual(test.context, Context);
      return Promise.resolve(test._evaluateContext()).then(function ($await_9) {
        try {
          assert.notStrictEqual(test.context, Context);
          assert.deepEqual(test.context, context);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'fails the test if evaluation failed'() {
    return new Promise(function ($return, $error) {
      var error, test;

      function Context() {
        throw error;
      }

      error = new Error('test-init-context-error');
      test = new Test(testName, testFn, null, Context);
      return Promise.resolve(throws({
        fn() {
          return new Promise(function ($return, $error) {
            return Promise.resolve(test._evaluateContext()).then(function ($await_10) {
              try {
                return $return();
              } catch ($boundEx) {
                return $error($boundEx);
              }
            }.bind(this), $error);
          }.bind(this));
        },

        error
      })).then(function ($await_11) {
        try {
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

};
module.exports = {
  'test suite context': TestSuiteContext,
  'test context': TestContext,
  'test suite context from tests': TestSuiteContextFromTests,
  'test _evaluateContext function': TestEvaluateContextFunction
};