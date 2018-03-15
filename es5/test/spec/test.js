var assert = require('assert');

var Test = require('../../src/test');

var name = 'The higher we soar the smaller we appear to those who cannot fly.';

var fn = function fn() {};

var errorMessage = 'When you are in doubt abstain.';
var Test_test_suite = {
  instance: {
    'sets the name'() {
      var test = new Test(name, fn);
      assert(test.name === name);
    },

    'sets the function'() {
      var test = new Test(name, fn);
      assert(test.fn === fn);
    },

    'sets variables to null'() {
      var test = new Test(name, fn);
      assert(test.started === null);
      assert(test.finished === null);
      assert(test.error === null);
      assert(test.result === null);
    },

    timeout: {
      'has a default timeout'() {
        var test = new Test(name, fn);
        assert(test.timeout === 2000);
      },

      'sets a timeout'() {
        var timeout = 1000;
        var test = new Test(name, fn, timeout);
        assert(test.timeout === timeout);
      }

    },

    'has the run method'() {
      var test = new Test(name, fn);
      assert(typeof test.run === 'function');
    }

  },
  runTest: {
    'fails test after specified timeout'() {
      return new Promise(function ($return, $error) {
        var timeout, fn, test, expectedMsg;
        timeout = 100;

        fn = function fn() {
          return new Promise(function ($return, $error) {
            return Promise.resolve(new Promise(function (r) {
              return setTimeout(r, timeout + 100);
            })).then(function ($await_1) {
              try {
                return $return();
              } catch ($boundEx) {
                return $error($boundEx);
              }
            }.bind(this), $error);
          }.bind(this));
        };

        test = new Test(name, fn, timeout);
        return Promise.resolve(test.run()).then(function ($await_2) {
          try {
            assert(test.hasErrors());
            expectedMsg = `Test has timed out after ${timeout}ms`;
            assert(test.error.message === expectedMsg);
            return $return();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this));
    },

    'runs a test'() {
      return new Promise(function ($return, $error) {
        var test, res;
        test = new Test(name, fn);
        res = test.run();
        assert(res instanceof Promise);
        assert(test.started !== null);
        return Promise.resolve(res).then(function ($await_3) {
          try {
            assert(test.error === null);
            assert(test.result === undefined);
            assert(test.finished !== null);
            return $return();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this));
    },

    'saves result of a test'() {
      return new Promise(function ($return, $error) {
        var result, test, res;
        result = 'test_string_result';
        test = new Test(name, function () {
          return result;
        });
        res = test.run();
        return Promise.resolve(res).then(function ($await_4) {
          try {
            assert(test.result === result);
            return $return();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this));
    },

    'should run a test with an error'() {
      return new Promise(function ($return, $error) {
        var test, res;
        test = new Test(name, function () {
          throw new Error(errorMessage);
        });
        res = test.run();
        return Promise.resolve(res).then(function ($await_5) {
          try {
            assert(test.result === null);
            assert(test.error !== null);
            assert(test.error.message === errorMessage);
            assert(test.result === null);
            return $return();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this));
    }

  },
  hasErrors: {
    'reports as having an error'() {
      return new Promise(function ($return, $error) {
        var test;
        test = new Test(name, function () {
          throw new Error(errorMessage);
        });
        return Promise.resolve(test.run()).then(function ($await_6) {
          try {
            assert(test.hasErrors());
            return $return();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this));
    },

    'reports as not having an error'() {
      return new Promise(function ($return, $error) {
        var test;
        test = new Test(name, function () {});
        return Promise.resolve(test.run()).then(function ($await_7) {
          try {
            assert(!test.hasErrors());
            return $return();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this));
    }

  }
};
module.exports = Test_test_suite;