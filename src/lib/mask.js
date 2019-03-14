import erte from 'erte'
import { equal } from 'assert'
import mismatch from 'mismatch'
import { readFileSync } from 'fs'

/**
 * @typedef {Object} Conf
 * @prop {string} path Path to the mask file.
 * @prop {RegExp} splitRe The regular expression to split the file by.
 */

/**
 * A function to construct tests from a mask file.
 * @param {Conf} conf
 */
const getTests = (conf) => {
  const {
    path, splitRe = /^\/\/ /gm,
  } = conf
  const m = `${readFileSync(path)}`
  const mi = splitRe.exec(m)
  if (!mi) throw new Error(`${path} does not contain tests.`)
  const mm = m.slice(mi.index)
  splitRe.lastIndex = 0
  const t = mm.split(splitRe).filter(a => a)
  const tests = t.map((test) => {
    const [name, total] = split(test, '\n')
    const [i, body] = split(total, '\n/*')
    const input = i.replace(/\n$/, '')

    const expected = mismatch(
      /\/\* +(.+) +\*\/(\n?)([\s\S]*?)\n\/\*\*\//g,
      body,
      ['key', 'newLine', 'value'],
    ).reduce((acc, { key, newLine, value }) => {
      const val = (!value && newLine) ? newLine : value
      return {
        ...acc,
        [key]: val,
      }
    }, {})
    return {
      name,
      input,
      ...expected,
    }
  })

  const lines = m.split('\n')
  /**
   * A function to be called on error in a test.
   * @param {string} name
   * @param {Error} error
   * @throws {Error} An error with a stack trace pointing at the line in the mask file.
   */
  const onError = (name, error) => {
    const lineRe = new RegExp(`${splitRe.source}${name}`)
    const lineNumber = lines.reduce((acc, current, index) => {
      if (acc) return acc // found
      if (lineRe.test(current)) return index + 1
      return acc
    }, null)
    const err = new Error(error.message)
    // possibly also remember custom test stack later
    const stack = makeStack(error.message, name, path, lineNumber)
    err.stack = stack
    throw err
  }
  const testsWithOnError = tests.map(({ name, ...rest }) => {
    /**
     * @type {function}
     * @param {Error} error An error with a stack trace pointing at the line in the mask file.
     */
    const boundOnError = onError.bind(null, name)
    return {
      ...rest,
      name,
      onError: boundOnError,
    }
  })
  return testsWithOnError
}

const makeStack = (message, name, path, lineNumber) => {
  return `Error: ${message}\n    at ${name} (${path}:${lineNumber}:1)`
}

const split = (s, del) => {
  const nl = s.indexOf(del)
  const first = s.substr(0, nl)
  const second = s.substr(nl + 1)
  return [first, second]
}


export const assertExpected = (result, expected) => {
  try {
    equal(result, expected)
  } catch (err) {
    const e = erte(result, expected)
    console.log(e) // eslint-disable-line no-console
    throw err
  }
}

export default getTests