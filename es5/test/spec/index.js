var assert = require('assert');

var zoroaster = require('../..');

var _require = require('path'),
    resolve = _require.resolve;

var _require2 = require('child_process'),
    ChildProcess = _require2.ChildProcess;

var TEST_SUITE_PATH = resolve(__dirname, '../fixtures/test_suite.js');
var indexTestSuite = {
  'exports a function'() {
    assert.equal(typeof zoroaster, 'function');
  },

  'returns a child process'() {
    return new Promise(function ($return, $error) {
      var proc;
      proc = zoroaster();
      assert(proc instanceof ChildProcess);
      return Promise.resolve(proc.promise).then(function ($await_1) {
        try {
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'returns a promise'() {
    return new Promise(function ($return, $error) {
      var proc;
      proc = zoroaster();
      assert(proc.promise instanceof Promise);
      return Promise.resolve(proc.promise).then(function ($await_2) {
        try {
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'reports on 0 tests executed when empty args'() {
    return new Promise(function ($return, $error) {
      var proc, res;
      proc = zoroaster();
      assert(proc.promise instanceof Promise);
      return Promise.resolve(proc.promise).then(function ($await_3) {
        try {
          res = $await_3;
          assert.equal('🦅  Executed 0 tests.', res.stdout.trim());
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  'should report on test suite executed'() {
    return new Promise(function ($return, $error) {
      var proc, res;
      proc = zoroaster([TEST_SUITE_PATH]);
      assert(proc.promise instanceof Promise);
      return Promise.resolve(proc.promise).then(function ($await_4) {
        try {
          res = $await_4;
          assert.equal(res.stderr, '');
          assert.equal(res.code, 1); // test fixtures not passing

          assert(res.stdout.length > 100);
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

};
module.exports = indexTestSuite;
