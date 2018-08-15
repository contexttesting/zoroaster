let throws = require('assert-throws'); if (throws && throws.__esModule) throws = throws.default;
const $default = require('assert')
const { equal: $equal, ok: $ok } = $default
const { deepEqual: $deepEqual } = require('assert-diff')

module.exports.equal = $equal
module.exports.ok = $ok
module.exports.assert = $default
module.exports.deepEqual = $deepEqual
module.exports.throws = throws