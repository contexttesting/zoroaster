var assert = require('assert');

var TestSuite = require('../../src/test_suite');

var lib = require('../lib');

var TEST_SUITE_NAME = 'test-suite';
module.exports = {
  'executes context as a function in each test'() {
    return new Promise(function ($return, $error) {
      var testData, newTestData, propName, getterCalled, setterCalled, firstContext, secondContext, testSuite;

      function Context() {
        var _testData = testData;
        getterCalled = false;
        setterCalled = false;
        Object.defineProperty(this, propName, {
          get: function get() {
            getterCalled = true;
            return _testData;
          },
          set: function set(value) {
            setterCalled = true;
            _testData = value;
          }
        });
      }

      testData = 'some-test-data';
      newTestData = 'some-new-test-data';
      propName = 'testData';
      getterCalled = false;
      setterCalled = false;
      testSuite = new TestSuite(TEST_SUITE_NAME, {
        testA(ctx) {
          assert(!getterCalled);
          assert(!setterCalled);
          assert.equal(ctx.testData, testData);
          assert(getterCalled);
          ctx.testData = newTestData;
          assert(setterCalled);
          assert.equal(ctx.testData, newTestData);
          firstContext = ctx;
        },

        testB(ctx) {
          // context is called each time for every test
          assert(!getterCalled);
          assert(!setterCalled);
          assert.equal(ctx.testData, testData);
          assert(getterCalled);
          secondContext = ctx;
        }

      }, null, Context);
      return Promise.resolve(testSuite.run()).then(function ($await_1) {
        try {
          lib.assertNoErrorsInTestSuite(testSuite);
          assert.notStrictEqual(firstContext, secondContext);
          assert.equal(firstContext[propName], newTestData);
          assert.equal(secondContext[propName], testData);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'executes context as a function in each test (as prop)'() {
    return new Promise(function ($return, $error) {
      var testData, newTestData, propName, getterCalled, setterCalled, firstContext, secondContext, testSuite;

      function Context() {
        var _testData = testData;
        getterCalled = false;
        setterCalled = false;
        Object.defineProperty(this, propName, {
          get: function get() {
            getterCalled = true;
            return _testData;
          },
          set: function set(value) {
            setterCalled = true;
            _testData = value;
          }
        });
      }

      testData = 'some-test-data';
      newTestData = 'some-new-test-data';
      propName = 'testData';
      getterCalled = false;
      setterCalled = false;
      testSuite = new TestSuite(TEST_SUITE_NAME, {
        context: Context,

        testA(ctx) {
          assert(!getterCalled);
          assert(!setterCalled);
          assert.equal(ctx.testData, testData);
          assert(getterCalled);
          ctx.testData = newTestData;
          assert(setterCalled);
          assert.equal(ctx.testData, newTestData);
          firstContext = ctx;
        },

        testB(ctx) {
          // context is called each time for every test
          assert(!getterCalled);
          assert(!setterCalled);
          assert.equal(ctx.testData, testData);
          assert(getterCalled);
          secondContext = ctx;
        }

      });
      return Promise.resolve(testSuite.run()).then(function ($await_2) {
        try {
          lib.assertNoErrorsInTestSuite(testSuite);
          assert.notStrictEqual(firstContext, secondContext);
          assert.equal(firstContext[propName], newTestData);
          assert.equal(secondContext[propName], testData);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'waits until promise returned by context is resolved'() {
    return new Promise(function ($return, $error) {
      var testData, testDataAfterPromise, newTestData, firstContext, secondContext, propName, testSuite;

      function Context() {
        return new Promise(function ($return, $error) {
          var _testData;

          _testData = testData;
          Object.defineProperty(this, propName, {
            get: function get() {
              return _testData;
            },
            set: function set(value) {
              _testData = value;
            }
          });
          return Promise.resolve(new Promise(function (r) {
            setTimeout(function () {
              _testData = testDataAfterPromise;
              r();
            }, 50);
          })).then(function ($await_3) {
            try {
              return $return();
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this), $error);
        }.bind(this));
      }

      testData = 'some-test-data';
      testDataAfterPromise = 'test-data-after-promise';
      newTestData = 'some-new-test-data';
      propName = 'testData';
      testSuite = new TestSuite(TEST_SUITE_NAME, {
        context: Context,

        testA(ctx) {
          assert.equal(ctx.testData, testDataAfterPromise);
          ctx.testData = newTestData;
          firstContext = ctx;
        },

        testB(ctx) {
          assert.equal(ctx.testData, testDataAfterPromise);
          secondContext = ctx;
        }

      });
      return Promise.resolve(testSuite.run()).then(function ($await_4) {
        try {
          lib.assertNoErrorsInTestSuite(testSuite);
          assert.notStrictEqual(firstContext, secondContext);
          assert.equal(firstContext[propName], newTestData);
          assert.equal(secondContext[propName], testDataAfterPromise);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'times out before context finishes resolving'() {
    return new Promise(function ($return, $error) {
      var testSuite;

      function Context() {
        return new Promise(function ($return, $error) {
          return Promise.resolve(new Promise(function (r) {
            return setTimeout(r, 200);
          })).then(function ($await_5) {
            try {
              return $return();
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this), $error);
        }.bind(this));
      }

      testSuite = new TestSuite(TEST_SUITE_NAME, {
        'should timeout'() {}

      }, null, Context, 150);
      return Promise.resolve(testSuite.run()).then(function ($await_6) {
        try {
          assert.throws(function () {
            return lib.assertNoErrorsInTestSuite(testSuite);
          }, /Error in test "test-suite > should timeout": Evaluate has timed out after 150ms/);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

};