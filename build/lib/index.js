let cleanStack = require('@artdeco/clean-stack'); if (cleanStack && cleanStack.__esModule) cleanStack = cleanStack.default;
const { EOL } = require('os');

       function indent(str, padding) {
  return str.replace(/^(?!\s*$)/mg, padding)
}

       function getPadding(level) {
  return Array
    .from({ length: level * 2 })
    .join(' ')
}

/**
 * Get clean stack for a test, without Node internals
 * @param {Test} test - test
 */
       function filterStack({ error, name }) {
  if (!error) {
    throw new Error('cannot filter stack when a test does not have an error')
  }
  const splitStack = error.stack.split('\n') // break stack by \n and not EOL intentionally because Node uses \n
  // node 4 will print: at test_suite.test2
  // node 6 will print: at test2
  const regex = new RegExp(`at (.+\\.)?${name}`)
  const resIndex = splitStack.findIndex(element => regex.test(element)) + 1
  const joinedStack = splitStack.slice(0, resIndex).join('\n')
  const stack = joinedStack ? joinedStack : cleanStack(error.stack) // use clean stack for async errors
  return stack.replace(/\n/g, EOL)
}

       function isFunction(fn) {
  return (typeof fn).toLowerCase() == 'function'
}

       const TICK = '\x1b[32m \u2713 \x1b[0m'
       const CROSS = '\x1b[31m \u2717 \x1b[0m'


module.exports.indent = indent
module.exports.getPadding = getPadding
module.exports.filterStack = filterStack
module.exports.isFunction = isFunction
module.exports.TICK = TICK
module.exports.CROSS = CROSS