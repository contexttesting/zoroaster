import erte from 'erte'
import { readdirSync, lstatSync } from 'fs'
import { resolve, join } from 'path'
import getTests from '../lib/mask'
import { equal, throws } from '../assert'

/**
 * Make a test suite to test against a mask.
 * @param {string} path Path to the mask file or directory of files.
 * @param {MakeTestSuiteConf} [conf] Configuration for making test suites.
 * @param {({new(): Context}|{new(): Context}[]|{})} [conf.context] Single or multiple context constructors or objects to initialise for each test.
 * @param {(input: string, ...contexts?: Context[]) => string} [conf.getResults] A function which should return results of a test.
 * @param {(input: string, ...contexts?: Context[]) => { fn: function, args?: any[], message?: (string|RegExp) }} [conf.getThrowsConfig] A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.
 * @param {(results: any) => string} [conf.mapActual] An optional function to get a value to test against `expected` mask property from results. By default, the full result is used.
 * @param {(results: any, props: Object.<string, (string|object)>) => void} [conf.assertResults] A function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask (where `jsonProps` are parsed into JS objects) will be passed as arguments.
 * @param {string[]} [conf.jsonProps] Any additional properties to extract from the mask, and parse as _JSON_ values.
 */
export default function makeTestSuite(path, conf) {
  const pathStat = lstatSync(path)
  if (pathStat.isFile()) {
    return makeATestSuite(path, conf)
  } else if (pathStat.isDirectory()) {
    const content = readdirSync(path)
    const res = content.reduce((acc, node) => {
      const newPath = join(path, node)
      return {
        ...acc,
        [node]: makeTestSuite(newPath, conf),
      }
    }, {})
    return res
  }
}

// The `expected` property of the mask will be compared against the actual value returned by the `getActual` function. To test for the correct error message, the `error` property will be tested using `assert-throws` configuration returned by `getThrowsConfig` function. Any additional tests can be performed with `customTest` function, which will receive any additional properties extracted from the mask using `customProps` and `jsonProps`. The JSON properties will be parsed into an object.

const makeATestSuite = (maskPath, conf) => {
  if (!conf) throw new Error('No configuration is given. A config should at least contain either a "getThrowsConfig" or "getResults" functions.')
  const {
    context,
    getResults,
    getThrowsConfig,
    mapActual = a => a,
    assertResults,
    jsonProps = [],
  } = conf
  const tests = getTests(maskPath)

  const hasFocused = tests.some(({ name }) => name.startsWith('!'))

  const t = tests.reduce((acc, {
    name, input, expected, error, onError, ...rest
  }) => {
    if (hasFocused && !name.startsWith('!')) return acc
    const nameError = name in acc ?
      new Error(`Repeated use of the test name "${name}".`) : null

    const fn = async (...contexts) => {
      if (nameError) throw nameError

      if (error) {
        if (!getThrowsConfig)
          throw new Error('No "getThrowsConfig" function is given.')
        const throwsConfig = getThrowsConfig(input, ...contexts)
        await assertError(throwsConfig, error)
        return
      }

      if (!getResults) return

      const parsedRest = Object.keys(rest).reduce((ac, k) => {
        try {
          const val = jsonProps.includes(k) ? JSON.parse(rest[k]) : rest[k]
          ac[k] = val
          return ac
        } catch (err) {
          throw new Error(`Could not parse JSON property "${k}": ${err.message}.`)
        }
      }, {})

      const results = await getResults(input, ...contexts)

      if (expected) {
        const actual = mapActual(results)
        if ((typeof actual).toLowerCase() != 'string')
          throw new Error('The actual result is not an a string. Use "mapActual" function to map to a string result.')
        assertExpected(actual, expected)
      }
      if (assertResults) {
        assertResults(results, parsedRest)
      }
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
 * @prop {({new(): Context}|{new(): Context}[]|{})} [context] Single or multiple context constructors or objects to initialise for each test.
 * @prop {(input: string, ...contexts?: Context[]) => string} [getResults] A function which should return results of a test.
 * @prop {(input: string, ...contexts?: Context[]) => { fn: function, args?: any[], message?: (string|RegExp) }} [getThrowsConfig] A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.
 * @prop {(results: any) => string} [mapActual] An optional function to get a value to test against `expected` mask property from results. By default, the full result is used.
 * @prop {(results: any, props: Object.<string, (string|object)>) => void} [assertResults] A function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask (where `jsonProps` are parsed into JS objects) will be passed as arguments.
 * @prop {string[]} [jsonProps] Any additional properties to extract from the mask, and parse as _JSON_ values.
 */

// export default makeTestSuite