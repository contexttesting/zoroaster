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

    const p = new Proxy(c, {
      get(target, key) {
        if (key == 'then') return target
        if (typeof target[key] == 'function') {
          return target[key].bind(target)
        }
        return target[key]
      },
    })

    return p
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

module.exports.indent = indent
module.exports.getPadding = getPadding
module.exports.filterStack = filterStack
module.exports.isFunction = isFunction
module.exports.evaluateContext = evaluateContext
module.exports.destroyContexts = destroyContexts
//# sourceMappingURL=index.js.map