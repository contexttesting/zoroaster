let cleanStack = require('clean-stack'); if (cleanStack && cleanStack.__esModule) cleanStack = cleanStack.default;
const { EOL } = require('os')

/**
 * Run all tests in sequence, one by one.
 * @param {Test[]} tests An array with tests
 * @param {function} [notify] A notify function to be passed to run method
 */
async function runInSequence(tests, notify) {
  await tests.reduce(async (acc, t) => {
    await acc
    await t.run(notify)
  }, Promise.resolve())
  return tests
}

function indent(str, padding) {
  return str.replace(/^(?!\s*$)/mg, padding)
}

function getPadding(level) {
  return Array
    .from({ length: level * 2 })
    .join(' ')
}

function checkTestSuiteName(name) {
  if (typeof name != 'string') {
    throw new Error('Test suite name must be given.')
  }
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
  const regex = new RegExp(`at (.+\.)?${name}`)
  const resIndex = splitStack.findIndex(element => regex.test(element)) + 1
  const joinedStack = splitStack.slice(0, resIndex).join('\n')
  const stack = joinedStack ? joinedStack : cleanStack(error.stack) // use clean stack for async errors
  return stack.replace(/\n/g, EOL)
}

function isFunction(fn) {
  return (typeof fn).toLowerCase() == 'function'
}

const bindMethods = (instance, ignore = []) => {
  const methods = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(instance))
  const boundMethods = Object.keys(methods)
    .filter((k) => {
      return ignore.indexOf(k) < 0
    })
    .reduce((acc, k) => {
      const method = methods[k]
      const isFn = isFunction(method.value)
      if (!isFn) return acc
      method.value = method.value.bind(instance)
      return {
        ...acc,
        [k]: method,
      }
    }, {})
  Object.defineProperties(instance, boundMethods)
}

const evaluateContext = async (context) => {
  const fn = isFunction(context)
  if (!fn) return context

  try {
    const c = {}
    await context.call(c)
    return c
  } catch (err) {
    if (!/^Class constructor/.test(err.message)) {
      throw err
    }
    // constructor context
    const c = new context()
    if (c._init) {
      await c._init()
    }

    bindMethods(c, ['constructor', '_init', '_destroy'])

    return c
  }
}

const destroyContexts = async (contexts) => {
  const dc = contexts.map(async (c) => {
    if (isFunction(c._destroy)) {
      const res = await c._destroy()
      return res
    }
  })
  const res = await Promise.all(dc)
  return res
}

module.exports.runInSequence = runInSequence
module.exports.indent = indent
module.exports.getPadding = getPadding
module.exports.checkTestSuiteName = checkTestSuiteName
module.exports.filterStack = filterStack
module.exports.isFunction = isFunction
module.exports.bindMethods = bindMethods
module.exports.evaluateContext = evaluateContext
module.exports.destroyContexts = destroyContexts