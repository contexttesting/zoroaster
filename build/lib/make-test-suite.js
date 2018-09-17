let erte = require('erte'); if (erte && erte.__esModule) erte = erte.default;
const { c: color } = require('erte');
const { readdirSync, lstatSync } = require('fs');
const { join } = require('path');
const { collect } = require('catchment');
const { fork } = require('spawncommand');
let mismatch = require('mismatch'); if (mismatch && mismatch.__esModule) mismatch = mismatch.default;
const { deepEqual } = require('assert-diff');
let getTests = require('../lib/mask'); if (getTests && getTests.__esModule) getTests = getTests.default;
const { equal, throws } = require('../assert');

/**
 * Make a test suite to test against a mask.
 * @param {string} path Path to the mask file or directory of files.
 * @param {MakeTestSuiteConf} [conf] Configuration for making test suites.
 * @param {({new(): Context}|{new(): Context}[]|{})} [conf.context] Single or multiple context constructors or objects to initialise for each test.
 * @param {(input: string, ...contexts?: Context[]) => string} [conf.getResults] A possibly async function which should return results of a test. If it returns a string, it will be compared against the `expected` property of the mask using string comparison. If it returns an object, its deep equality with `expected` can be tested by adding `'expected'` to the `jsonProps`.
 * @param {(...contexts?: Context[]) => Transform|Promise.<Transform>} [conf.getTransform] A possibly async function which returns a _Transform_ stream to be ended with the input specified in the mask. Its output will be accumulated and compared against the expected output of the mask.
 * @param {(input: string, ...contexts?: Context[]) => Readable|Promise.<Readable>} [conf.getReadable] A possibly async function which returns a _Readable_ stream constructed with the input from the mask. Its output will be stored in memory and compared against the expected output of the mask. This could be used to test a forked child process, for example.
 * @param {string} [conf.fork] A path to the module which will be forked with input as arguments, and its output compared against the `code`, `stdout` and `stderr` properties of the mask. Arguments with whitespace should be wrapped in speech marks, i.e. `'` or `"`.
 * @param {(input: string, ...contexts?: Context[]) => { fn: function, args?: any[], message?: (string|RegExp) }} [conf.getThrowsConfig] A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.
 * @param {(results: any) => string} [conf.mapActual] An optional function to get a value to test against `expected` mask property from results. By default, the full result is used.
 * @param {(results: any, props: Object.<string, (string|object)>) => void} [conf.assertResults] A function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask (where `jsonProps` are parsed into JS objects) will be passed as arguments.
 * @param {string[]} [conf.jsonProps] Any additional properties to extract from the mask, and parse as _JSON_ values.
 * @param {RegExp} [conf.splitRe="/^\/\/ /gm"] A regular expression used to detect the beginning of a new test in a mask file. Default `/^\/\/ /gm`.
 */
               function makeTestSuite(path, conf) {
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

const parseProps = (props, jsonProps) => {
  const parsedRest = Object.keys(props).reduce((ac, k) => {
    try {
      const val = jsonProps.includes(k) ? JSON.parse(props[k]) : props[k]
      ac[k] = val
      return ac
    } catch (err) {
      throw new Error(`Could not parse JSON property "${k}": ${err.message}.`)
    }
  }, {})
  return parsedRest
}

/**
 * Create a new test.
 * @param {{ getTransform: () => Transform, getReadable: (input: string) => Readable }} param
 */
const makeTest = ({
  input, error, getThrowsConfig, getTransform, getResults, expected,
  assertResults, props, mapActual, getReadable,
}) => {
  const test = async (...contexts) => {
    if (error) {
      if (!getThrowsConfig)
        throw new Error('No "getThrowsConfig" function is given.')
      const throwsConfig = getThrowsConfig(input, ...contexts)
      await assertError(throwsConfig, error)
      return
    } else if (getTransform) {
      if (expected === undefined) throw new Error('No expected output was given.')
      const rs = await getTransform(...contexts)
      rs.end(input)
      const actual = await collect(rs)
      assertExpected(actual, expected)
      return
    } else if (getReadable) {
      if (expected === undefined) throw new Error('No expected output was given.')
      const rs = await getReadable(input, ...contexts)
      const actual = await collect(rs)
      assertExpected(actual, expected)
      return
    }

    if (!getResults) throw new Error('Nothing was tested.')

    const results = await getResults(input, ...contexts)

    if (expected !== undefined) {
      const actual = mapActual(results)
      if (typeof expected != 'string') { // already parsed
        deepEqual(actual, expected)
      } else if ((typeof actual).toLowerCase() != 'string') {
        throw new Error('The actual result is not an a string. Use "mapActual" function to map to a string result, or add "expected" to "jsonProps".')
      } else {
        assertExpected(actual, expected)
      }
    }
    if (assertResults) {
      assertResults(results, props)
    }
  }
  return test
}

       const getArgs = (input) => {
  const res = mismatch(/(['"])?([\s\S]+?)\1(\s+|$)/g, input, ['q', 'a'])
    .map(({ a }) => a)
  return res
}

const makeForkTest = (forkModule, input, { stdout, stderr, code }) => {
  return async () => {
    const args = getArgs(input)
    const f = fork(forkModule, args, {
      stdio: 'pipe',
    })
    const [, o, e, c] = await Promise.all([
      f.promise,
      collect(f.stdout),
      collect(f.stderr),
      new Promise(r => f.on('exit', cc => r(cc))),
    ])
    if (stdout) assertExpected(stdout, o)
    if (stderr) assertExpected(stderr, e)
    if (code && c != code) throw new Error(`Fork exited with code ${c} != ${code}`)
  }
}

const makeATestSuite = (maskPath, conf) => {
  if (!conf) throw new Error('No configuration is given. A config should at least contain either a "getThrowsConfig", "getResults", "getTransform" or "getReadable" functions.')
  const {
    context,
    getResults,
    getTransform,
    getReadable,
    getThrowsConfig,
    mapActual = a => a,
    assertResults,
    jsonProps = [],
    splitRe,
    fork: forkModule,
  } = conf
  const tests = getTests({ path: maskPath, splitRe })

  const t = tests.reduce((acc, {
    name, input, error, onError, ...rest
  }) => {
    let setupError
    let props
    let expected
    if (name in acc) setupError = `Repeated use of the test name "${name}".`
    try {
      ({ expected, ...props } = parseProps(rest, jsonProps))
    } catch ({ message }) {
      setupError = message
    }

    let test
    if (setupError) {
      test = () => { throw new Error(setupError) }
    } else if (forkModule) {
      test = makeForkTest(forkModule, input, props)
    } else {
      test = makeTest({
        input, error, getThrowsConfig, getTransform, getReadable, getResults, expected,
        assertResults, props, mapActual,
      })
    }

    acc[name] = async (...args) => {
      try {
        await test(...args)
      } catch (err) {
        if (process.env.DEBUG) console.log(color(err.stack, 'red'))
        onError(err) // show location in the error stack. TODO: keep mask line
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
 * @typedef {import('stream').Transform} Transform
 * @typedef {import('stream').Readable} Readable
 *
 * @typedef {Object} Context A context made with a constructor.
 * @prop {() => void} [_init] A function to initialise the context.
 * @prop {() => void} [_destroy] A function to destroy the context.
 *
 * @typedef {Object} MakeTestSuiteConf Configuration for making test suites.
 * @prop {({new(): Context}|{new(): Context}[]|{})} [context] Single or multiple context constructors or objects to initialise for each test.
 * @prop {(input: string, ...contexts?: Context[]) => string} [getResults] A possibly async function which should return results of a test. If it returns a string, it will be compared against the `expected` property of the mask using string comparison. If it returns an object, its deep equality with `expected` can be tested by adding `'expected'` to the `jsonProps`.
 * @prop {(...contexts?: Context[]) => Transform|Promise.<Transform>} [getTransform] A possibly async function which returns a _Transform_ stream to be ended with the input specified in the mask. Its output will be accumulated and compared against the expected output of the mask.
 * @prop {(input: string, ...contexts?: Context[]) => Readable|Promise.<Readable>} [getReadable] A possibly async function which returns a _Readable_ stream constructed with the input from the mask. Its output will be stored in memory and compared against the expected output of the mask. This could be used to test a forked child process, for example.
 * @prop {string} [fork] A path to the module which will be forked with input as arguments, and its output compared against the `code`, `stdout` and `stderr` properties of the mask. Arguments with whitespace should be wrapped in speech marks, i.e. `'` or `"`.
 * @prop {(input: string, ...contexts?: Context[]) => { fn: function, args?: any[], message?: (string|RegExp) }} [getThrowsConfig] A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.
 * @prop {(results: any) => string} [mapActual] An optional function to get a value to test against `expected` mask property from results. By default, the full result is used.
 * @prop {(results: any, props: Object.<string, (string|object)>) => void} [assertResults] A function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask (where `jsonProps` are parsed into JS objects) will be passed as arguments.
 * @prop {string[]} [jsonProps] Any additional properties to extract from the mask, and parse as _JSON_ values.
 * @prop {RegExp} [splitRe="/^\/\/ /gm"] A regular expression used to detect the beginning of a new test in a mask file. Default `/^\/\/ /gm`.
 */


module.exports = makeTestSuite
module.exports.getArgs = getArgs
//# sourceMappingURL=make-test-suite.js.map