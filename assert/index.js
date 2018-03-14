const assert = require('assert')
const assertDiff = require('assert-diff')
const throws = require('assert-throws/es5/src')

const equal = assert.equal
const deepEqual = assertDiff.deepEqual

module.exports = {
  equal,
  deepEqual,
  throws,
  assert,
}
