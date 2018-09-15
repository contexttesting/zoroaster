let mismatch = require('mismatch'); if (mismatch && mismatch.__esModule) mismatch = mismatch.default;
const { readFileSync } = require('fs');

/**
 * A function to construct tests from a mask file.
 * @param {string} path Path to the mask file.
 */
const getTests = ({
  path, splitRe = /^\/\/ /gm,
}) => {
  const m = `${readFileSync(path)}`
  const t = m.split(splitRe).filter(a => a)
  const tests = t.map((test) => {
    const [name, total] = split(test, '\n')
    const [input, body] = split(total, '\n\n/*')

    const expected = mismatch(
      /\/\* +(.+) +\*\/\n([\s\S]+?)\n\/\*\*\//g,
      body,
      ['key', 'value'],
    ).reduce((acc, { key, value }) => {
      return {
        ...acc,
        [key]: value,
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
    const lineRe = new RegExp(`^// +${name}`)
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

module.exports=getTests
//# sourceMappingURL=mask.js.map