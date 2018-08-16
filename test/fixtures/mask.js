// single
export default function test() {}

/* expected */
module.exports = function test() {}
/**/
/* exports */
[{ "default": "test" }]
/**/

// multiple
export function test() {}
export function test2() {}

/* expected */
module.exports.test = function test() {}
module.exports.test2 = function test() {}
/**/
/* exports */
[{ "test": "test" }, { "test": "test2" }]
/**/