var assert = require('assert');

var assertSrc = require('../../../assert');

var equal = assertSrc.equal;
var deepEqual = assertSrc.deepEqual;
var testAssert = assertSrc.assert;
var assertTestSuite = {
  'throws if not equal'() {
    try {
      equal('a', 'b');
      throw new Error('should have thrown');
    } catch (error) {
      assert.equal(error.operator, '==');
      assert.equal(error.actual, 'a');
      assert.equal(error.expected, 'b');
    }
  },

  'throws if not deep equal'() {
    try {
      deepEqual({
        test: 'string'
      }, {
        test: 'string-2'
      });
      throw new Error('should have thrown');
    } catch (error) {
      var message = error.message;
      assert(/\+ {2}test: "string"/.test(message));
      assert(/- {2}test: "string-2"/.test(message));
    }
  },

  'throws if not true'() {
    try {
      testAssert(false);
      throw new Error('should have thrown');
    } catch (error) {
      var message = error.message;
      assert.equal(message, 'false == true');
    }
  }

};
module.exports = assertTestSuite;