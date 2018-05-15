import { resolve } from 'path'
import { fork } from 'spawncommand'
import { SpawnOptions } from 'child_process' // eslint-disable-line no-unused-vars

const BIN = resolve(__dirname, 'bin')

/**
 * Start zoroaster process, and return a child process with a `promise` property.
 * @param {string[]} args An array of strings as arguments
 * @param {SpawnOptions} options Options to pass when creating child process
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

export default run
