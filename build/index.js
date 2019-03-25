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



const $assert_throws = require('assert-throws');
const $assert = require('assert');
const $assert_diff = require('assert-diff');

       const makeTestSuite = () => {
  throw new Error('Please use @zoroaster/mask for mask testing.')
}

const $_Zoroaster = require('./Zoroaster');

module.exports = $_Zoroaster
module.exports.makeTestSuite = makeTestSuite
module.exports.throws = $assert_throws
module.exports.assert = $assert
module.exports.equal = $assert.equal
module.exports.ok = $assert.ok
module.exports.deepEqual = $assert_diff.deepEqual
module.exports.run = run