var _require = require('assert'),
    equal = _require.equal;

var TestSuite = require('../../src/test_suite');

var _require2 = require('../lib'),
    assertNoErrorsInTestSuite = _require2.assertNoErrorsInTestSuite;

var multipleContextTestSuite = {
  'passes multiple contexts to tests'() {
    return new Promise(function ($return, $error) {
      var testSuite;
      testSuite = new TestSuite('test', {
        context: [function contextA() {
          return new Promise(function ($return, $error) {
            this.data = 'A';
            return $return();
          }.bind(this));
        }, function contextB() {
          return new Promise(function ($return, $error) {
            this.data = 'B';
            return $return();
          }.bind(this));
        }],

        testA(_ref, _ref2) {
          var A = _ref.data;
          var B = _ref2.data;
          equal(A, 'A');
          equal(B, 'B');
        }

      });
      return Promise.resolve(testSuite.run()).then(function ($await_1) {
        try {
          assertNoErrorsInTestSuite(testSuite);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'destroys multiple contexts'() {
    return new Promise(function ($return, $error) {
      var calledA, calledB, testSuite;
      testSuite = new TestSuite('test', {
        context: [function contextA() {
          return new Promise(function ($return, $error) {
            this._destroy = function () {
              calledA = true;
            };

            return $return();
          }.bind(this));
        }, function contextB() {
          return new Promise(function ($return, $error) {
            this._destroy = function () {
              calledB = true;
            };

            return $return();
          }.bind(this));
        }],

        testA() {
          equal(1, 1);
        }

      });
      return Promise.resolve(testSuite.run()).then(function ($await_2) {
        try {
          assertNoErrorsInTestSuite(testSuite);
          equal(calledA, true);
          equal(calledB, true);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

};
module.exports = multipleContextTestSuite;