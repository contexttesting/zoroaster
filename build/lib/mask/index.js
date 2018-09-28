let erte = require('erte'); if (erte && erte.__esModule) erte = erte.default;
const { equal } = require('assert');

       const assertExpected = (result, expected) => {
  try {
    equal(result, expected)
  } catch (err) {
    const e = erte(result, expected)
    console.log(e) // eslint-disable-line no-console
    throw err
  }
}

/**
 * Write data to `stdin` when data from the `stdout` matches the regexp.
 * @param {Readable} readable
 * @param {Writable} stdin
 * @param {[RegExp, string][]} inputs
 * @param {Writable} log
 */
       const setupAnswers = (readable, stdin, inputs = [], log) => {
  if (log) readable.on('data', d => log.write(d))

  let [a, ...rest] = inputs
  if (!a) return

  const handler = (d) => {
    const [regexp, answer] = a
    if (!regexp.test(d)) return

    const an = `${answer}\n`
    if (log) log.write(an)

    stdin.write(an)
    ;([a, ...rest] = rest)
    if (!a) readable.removeListener('data', handler)
  }
  readable.on('data', handler)
}

/** @typedef {import('stream').Readable} Readable */
/** @typedef {import('stream').Writable} Writable */

module.exports.assertExpected = assertExpected
module.exports.setupAnswers = setupAnswers
//# sourceMappingURL=index.js.map