let throws = require('assert-throws'); if (throws && throws.__esModule) throws = throws.default;
const $assert = require('assert');
const $assert_diff = require('assert-diff');



module.exports.assert = $assert
module.exports.equal = $assert.equal
module.exports.ok = $assert.ok
module.exports.deepEqual = $assert_diff.deepEqual
module.exports.throws = throws
//# sourceMappingURL=index.js.map