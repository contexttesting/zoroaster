const { resolve } = require('path')
const { fork } = require('spawncommand')
let makeTestSuite = require('./lib/make-test-suite'); if (makeTestSuite && makeTestSuite.__esModule) makeTestSuite = makeTestSuite.default;

const BIN = resolve(__dirname, 'bin', process.env.BABEL_ENV == 'test-build' ? 'zoroaster.js' : 'index.js')

/**
 * Start zoroaster process, and return a child process with a `promise` property.
 * @param {string[]} args An array of strings as arguments
 * @param {import('child_process').SpawnOptions} options Options to pass when creating child process
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

module.exports = run

const $default = require('./lib/mask')

module.exports.getTests = $default
module.exports.makeTestSuite = makeTestSuite