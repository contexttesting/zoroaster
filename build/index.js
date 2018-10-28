const { join } = require('path');
const { fork } = require('spawncommand');

const BIN = join(__dirname, 'bin', process.env.ALAMODE_ENV == 'test-build' ? 'zoroaster' : '')

/**
 * Start zoroaster process, and return a child process with a `promise` property.
 * @param {string[]} args An array of strings as arguments
 * @param {import('child_process').ForkOptions} options Options to pass when creating child process
 * @returns {ChildProcess} An instance of a ChildProcess, with `.promise` property,
 * which will be resolved when tests are finished.
 */
function run(args, options = {}) {
  const proc = fork(BIN, args, {
    stdio: 'pipe',
    ...options,
  })
  return proc
}

module.exports=run

const $_lib_make_test_suite = require('./lib/make-test-suite');

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
 * @prop {(results: any, props: Object.<string, (string|object)>) => void} [assertResults] A function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask using `customProps` and `jsonProps` will be passed as first and second arguments.
 * @prop {string[]} [customProps] An array of custom properties' names to extract from the mask.
 * @prop {string[]} [jsonProps] Any additional properties to extract from the mask, and parse as _JSON_ values.
 */


module.exports.makeTestSuite = $_lib_make_test_suite