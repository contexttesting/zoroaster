import cleanStack from 'clean-stack'
import { EOL } from 'os'

/**
 * Run all tests in sequence, one by one.
 * @param {Test[]} tests An array with tests
 * @param {function} [notify] A notify function to be passed to run method
 */
export async function runInSequence(tests, notify) {
  await tests.reduce(async (acc, t) => {
    await acc
    await t.run(notify)
  }, Promise.resolve())
  return tests
}

export function indent(str, padding) {
  return str.replace(/^(?!\s*$)/mg, padding)
}

export function getPadding(level) {
  return Array
    .from({ length: level * 2 })
    .join(' ')
}

export function checkContext(context) {
  const type = (typeof context).toLowerCase()
  if (Array.isArray(context)) {
    return // arrays from 1.1.0
  } else if (type == 'function') {
    return // functions are accepted from 0.4.1
  } else if (context != undefined && type != 'object') {
    throw new Error('Context must be an object.')
  } else if (context === null) {
    throw new Error('Context cannot be null.')
  }
}

export function checkTestSuiteName(name) {
  if (typeof name != 'string') {
    throw new Error('Test suite name must be given.')
  }
}

/**
 * Get clean stack for a test, without Node internals
 * @param {Test} test - test
 */
export function filterStack({ error, name }) {
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

export function isFunction(fn) {
  return (typeof fn).toLowerCase() == 'function'
}

export const bindMethods = (instance, ignore = []) => {
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
