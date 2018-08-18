let erte = require('erte'); if (erte && erte.__esModule) erte = erte.default;
let getTests = require('../lib/mask'); if (getTests && getTests.__esModule) getTests = getTests.default;
const { equal, throws } = require('../assert')

/**
 * Make a test suite to test against a mask. The `expected` property of the mask will be compared against the actual value returned by the `getActual` function. To test for the correct error message, the `error` property will be tested using `assert-throws` configuration returned by `getThrowsConfig` function. Any additional tests can be performed with `customTest` function, which will receive any additional properties extracted from the mask using `customProps` and `jsonProps`. The JSON properties will be parsed into an object.
 * @param {string} maskPath Path to the mask.
 * @param {MakeTestSuiteConf} [conf] Configuration for making test suites.
 * @param {(input: string, ...contexts?: Context[]) => string} [conf.getActual] A function which should return the actual value as a string to be compared with `expected` mask property.
 * @param {(input: string, ...contexts?: Context[]) => { fn: function, args?: any[], message?: (string|RegExp) }} [conf.getThrowsConfig] A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.
 * @param {({new(): Context}|{new(): Context}[]|{})} [conf.context] Single or multiple context constructors or objects to initialise for each test.
 * @param {(input: string, props: Object.<string, (string|object)>, ...contexts?: Context[])} [conf.customTest] Additional custom-written tests to execute.
 * @param {string[]} [conf.customProps] An array of custom properties' names to extract from the mask.
 * @param {string[]} [conf.jsonProps] Any additional properties to extract from the mask, and parse as _JSON_ values.
 */
const makeTestSuite = (maskPath, conf) => {
  const {
    getActual,
    getThrowsConfig,
    context,
    customTest,
    customProps = [],
    jsonProps = [],
  } = conf
  const tests = getTests(maskPath, [
    'expected',
    'error',
    ...customProps,
    ...jsonProps,
  ])

  const hasFocused = tests.some(({ name }) => name.startsWith('!'))

  const t = tests.reduce((acc, {
    name, input, expected, error, onError, ...rest
  }) => {
    if (hasFocused && !name.startsWith('!')) return acc
    const nameError = name in acc ?
      new Error(`Repeated use of the test name ${name}.`) : null

    const fn = async (...contexts) => {
      if (nameError) throw nameError

      if (error) {
        if (!getThrowsConfig)
          throw new Error('No getThrowsConfig function is given.')
        const throwsConfig = getThrowsConfig(input, ...contexts)
        await assertError(throwsConfig, error)
        return
      }
      if (expected) {
        if (!getActual)
          throw new Error('No getActual function is given.')
        const actual = await getActual(input, ...contexts)
        assertExpected(actual, expected)
      }
      const parsedRest = Object.keys(rest).reduce((ac, k) => {
        const val = jsonProps.includes(k) ? JSON.parse(rest[k]) : rest[k]
        ac[k] = val
        return ac
      }, {})
      if (customTest) await customTest(input, parsedRest, ...contexts)
    }
    acc[name] = async (...args) => {
      try {
        await fn(...args)
      } catch (err) {
        onError(err)
      }
    }
    return acc
  }, context ? { context } : {})
  return t
}

const assertError = async (throwsConfig, error) => {
  await throws({
    ...throwsConfig,
    message: error,
  })
}

const assertExpected = (result, expected) => {
  if (!expected) return
  try {
    equal(result, expected)
  } catch (err) {
    const e = erte(result, expected)
    console.log(e) // eslint-disable-line no-console
    throw err
  }
}

/* documentary types/make-test-suite.xml */
/**
 * @typedef {Object} Context A context made with a constructor.
 * @prop {() => void} [_init] A function to initialise the context.
 * @prop {() => void} [_destroy] A function to destroy the context.
 *
 * @typedef {Object} MakeTestSuiteConf Configuration for making test suites.
 * @prop {(input: string, ...contexts?: Context[]) => string} [getActual] A function which should return the actual value as a string to be compared with `expected` mask property.
 * @prop {(input: string, ...contexts?: Context[]) => { fn: function, args?: any[], message?: (string|RegExp) }} [getThrowsConfig] A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.
 * @prop {({new(): Context}|{new(): Context}[]|{})} [context] Single or multiple context constructors or objects to initialise for each test.
 * @prop {(input: string, props: Object.<string, (string|object)>, ...contexts?: Context[])} [customTest] Additional custom-written tests to execute.
 * @prop {string[]} [customProps] An array of custom properties' names to extract from the mask.
 * @prop {string[]} [jsonProps] Any additional properties to extract from the mask, and parse as _JSON_ values.
 */

module.exports = makeTestSuite