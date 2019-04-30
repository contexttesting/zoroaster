const $assert_throws = require('assert-throws');
const $assert = require('assert');
const $zoroaster_deep_equal = require('@zoroaster/deep-equal');

module.exports.throws = $assert_throws
module.exports.assert = $assert
module.exports.equal = $assert.equal
module.exports.ok = $assert.ok
module.exports.deepEqual = $zoroaster_deep_equal