var assert = require('assert');

var assertDiff = require('assert-diff');

var throws = require('assert-throws/es5/src');

var equal = assert.equal;
var deepEqual = assertDiff.deepEqual;
module.exports = {
  equal,
  deepEqual,
  throws,
  assert
};