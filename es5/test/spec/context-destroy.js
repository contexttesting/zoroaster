var assert = require('assert');

var TestSuite = require('../../src/test_suite');

var lib = require('../lib');

var TEST_SUITE_NAME = 'test-suite';
var ObjectContext = {
  'calls _destroy'() {
    return new Promise(function ($return, $error) {
      var destroyed, Context, testSuite;
      destroyed = false;
      Context = {
        _destroy() {
          destroyed = true;
        }

      };
      testSuite = new TestSuite(TEST_SUITE_NAME, {
        test: function test() {}
      }, null, Context);
      return Promise.resolve(testSuite.run()).then(function ($await_1) {
        try {
          lib.assertNoErrosInTestSuite(testSuite);
          assert(destroyed);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'calls async _destroy'() {
    return new Promise(function ($return, $error) {
      var destroyed, Context, testSuite;
      destroyed = false;
      Context = {
        _destroy() {
          return new Promise(function ($return, $error) {
            return Promise.resolve(new Promise(function (r) {
              return setTimeout(r, 50);
            })).then(function ($await_2) {
              try {
                destroyed = true;
                return $return();
              } catch ($boundEx) {
                return $error($boundEx);
              }
            }.bind(this), $error);
          }.bind(this));
        }

      };
      testSuite = new TestSuite(TEST_SUITE_NAME, {
        test: function test() {}
      }, null, Context);
      return Promise.resolve(testSuite.run()).then(function ($await_3) {
        try {
          lib.assertNoErrosInTestSuite(testSuite);
          assert(destroyed);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

};
var FunctionContext = {
  'calls _destroy'() {
    return new Promise(function ($return, $error) {
      var destroyed, testSuite;

      function Context() {
        this._destroy = function () {
          destroyed = true;
        };
      }

      destroyed = false;
      testSuite = new TestSuite(TEST_SUITE_NAME, {
        test: function test() {}
      }, null, Context);
      return Promise.resolve(testSuite.run()).then(function ($await_4) {
        try {
          lib.assertNoErrosInTestSuite(testSuite);
          assert(destroyed);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'calls async _destroy'() {
    return new Promise(function ($return, $error) {
      var destroyed, testSuite;

      function Context() {
        this._destroy = function () {
          return new Promise(function ($return, $error) {
            return Promise.resolve(new Promise(function (r) {
              return setTimeout(r, 50);
            })).then(function ($await_5) {
              try {
                destroyed = true;
                return $return();
              } catch ($boundEx) {
                return $error($boundEx);
              }
            }.bind(this), $error);
          }.bind(this));
        };
      }

      destroyed = false;
      testSuite = new TestSuite(TEST_SUITE_NAME, {
        test: function test() {}
      }, null, Context);
      return Promise.resolve(testSuite.run()).then(function ($await_6) {
        try {
          lib.assertNoErrosInTestSuite(testSuite);
          assert(destroyed);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'fails the test when _destroy throws an error'() {
    return new Promise(function ($return, $error) {
      var error, testSuite;

      function Context() {
        this._destroy = function () {
          throw error;
        };
      }

      error = new Error('test error message');
      testSuite = new TestSuite(TEST_SUITE_NAME, {
        test: function test() {}
      }, null, Context);
      return Promise.resolve(testSuite.run()).then(function ($await_7) {
        try {
          assert.strictEqual(testSuite.tests[0].error, error);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'fails the test when async _destroy throws an error'() {
    return new Promise(function ($return, $error) {
      var error, testSuite;

      function Context() {
        this._destroy = function () {
          return new Promise(function ($return, $error) {
            return $error(error);
          }.bind(this));
        };
      }

      error = new Error('test error message');
      testSuite = new TestSuite(TEST_SUITE_NAME, {
        test: function test() {}
      }, null, Context);
      return Promise.resolve(testSuite.run()).then(function ($await_8) {
        try {
          assert.strictEqual(testSuite.tests[0].error, error);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'times out if _destroy is taking too long'() {
    return new Promise(function ($return, $error) {
      var destroyed, testSuite;

      function Context() {
        this._destroy = function () {
          return new Promise(function ($return, $error) {
            return Promise.resolve(new Promise(function (r) {
              return setTimeout(r, 500);
            })).then(function ($await_9) {
              try {
                destroyed = true;
                return $return();
              } catch ($boundEx) {
                return $error($boundEx);
              }
            }.bind(this), $error);
          }.bind(this));
        };
      }

      destroyed = false;
      testSuite = new TestSuite(TEST_SUITE_NAME, {
        'should timeout'() {}

      }, null, Context, 250);
      return Promise.resolve(testSuite.run()).then(function ($await_10) {
        try {
          assert.throws(function () {
            return lib.assertNoErrosInTestSuite(testSuite);
          }, /Error in test "test-suite > should timeout": Destroy has timed out after 250ms/);
          assert(!destroyed);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'calls _destroy after test timeout'() {
    return new Promise(function ($return, $error) {
      var destroyed, testSuite;

      function Context() {
        this._destroy = function () {
          destroyed = true;
        };
      }

      destroyed = false;
      testSuite = new TestSuite(TEST_SUITE_NAME, {
        'should timeout'() {
          return new Promise(function ($return, $error) {
            return Promise.resolve(new Promise(function (r) {
              return setTimeout(r, 500);
            })).then(function ($await_11) {
              try {
                return $return();
              } catch ($boundEx) {
                return $error($boundEx);
              }
            }.bind(this), $error);
          }.bind(this));
        }

      }, null, Context, 250);
      return Promise.resolve(testSuite.run()).then(function ($await_12) {
        try {
          assert.throws(function () {
            return lib.assertNoErrosInTestSuite(testSuite);
          }, /Error in test "test-suite > should timeout": Test has timed out after 250ms/);
          assert(destroyed);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'updates test\'s destroyResult'() {
    return new Promise(function ($return, $error) {
      var destroyReturnValue, testSuite;

      function Context() {
        this._destroy = function () {
          return destroyReturnValue;
        };
      }

      destroyReturnValue = 'test-value';
      testSuite = new TestSuite(TEST_SUITE_NAME, {
        'should pass'() {}

      }, null, Context);
      return Promise.resolve(testSuite.run()).then(function ($await_13) {
        try {
          assert.equal(testSuite.tests[0].destroyResult, destroyReturnValue);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

};
module.exports = {
  FunctionContext,
  ObjectContext
};