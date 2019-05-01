import cleanStack from '@artdeco/clean-stack'
import { EOL } from 'os'
import { c } from 'erte'

export function indent(str, padding) {
  return str.replace(/^(?!\s*$)/mg, padding)
}

export function getPadding(level) {
  return Array
    .from({ length: level * 2 })
    .join(' ')
}

/**
 * Get clean stack for a test, without Node internals
 * @param {Object} test
 * @param {Error} test.error
 * @param {string} test.name
 */
export function filterStack({ error, name }) {
  if (!error)
    throw new Error('cannot filter stack when a test does not have an error')

  const splitStack = error.stack.split('\n') // break stack by \n and not EOL intentionally because Node uses \n
  // node 4 will print: at test_suite.test2
  // node 6 will print: at test2
  const regex = new RegExp(`at (.+\\.)?${name}`)
  const resIndex = splitStack.findIndex(element => regex.test(element)) + 1
  const joinedStack = splitStack.slice(0, resIndex).join('\n')
  const stack = joinedStack ? joinedStack : cleanStack(error.stack) // use clean stack for async errors
  return stack.replace(/\n/g, EOL)
}

export function isFunction(fn) {
  return (typeof fn).toLowerCase() == 'function'
}

export const TICK = ' ' + c('\u2713', 'green') + ' '
export const CROSS = ' ' + c('\u2717', 'red') + ' '

export const replaceFilename = (filename) => {
  return filename.replace(/\.jsx?$/, '')
}