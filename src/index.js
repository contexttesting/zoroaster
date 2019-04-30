import { join } from 'path'
import { fork } from 'spawncommand'

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

export { run }

export { default as throws } from 'assert-throws'
export { default as assert, equal, ok } from 'assert'
export { default as deepEqual } from '@zoroaster/deep-equal'

export const makeTestSuite = () => {
  throw new Error('Please use @zoroaster/mask for mask testing.')
}

export { default } from './Zoroaster'