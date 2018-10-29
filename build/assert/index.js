const $assert_throws = require('assert-throws');
const $assert = require('assert');
const $assert_diff = require('assert-diff');

module.exports.throws = $assert_throws
module.exports.assert = $assert
module.exports.equal = $assert.equal
module.exports.ok = $assert.ok
module.exports.deepEqual = $assert_diff.deepEqual