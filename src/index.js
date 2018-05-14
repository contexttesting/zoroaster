import { resolve } from 'path'
import spawnCommand from 'spawncommand'

const BIN_PATH = resolve(__dirname, 'bin/zoroaster.js')

const getSpawnOptions = (bin, args = []) => {
  if (!/^win/.test(process.platform)) { // linux
    return { program: bin, args }
  } else { // windows
    const { env: { comspec } } = process
    return {
      program: comspec,
      args: ['/c', 'node', bin, ...args],
    }
  }
}

/**
 * Start zoroaster process, and return a child process with .promise property.
 * Basically, a spawnCommand wrapper around zoroaster binary. Works on Windows
 * as well as Linux.
 * @param {string[]} args An array of strings as arguments
 * @param {object} options Options to pass when creating child process
 * @returns {ChildProcess} An instance of a ChildProcess, with `.promise` property,
 * which will be resolved when tests are finished.
 */
function run(args, options) {
  const { program, args: a } = getSpawnOptions(BIN_PATH, args)
  const proc = spawnCommand(program, a, options)
  return proc
}

export default run
