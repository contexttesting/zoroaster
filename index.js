const path = require('path')
const spawnCommand = require('spawncommand')

const BIN_PATH = path.join(__dirname, 'bin/zoroaster')

/**
 * Start zoroaster process, and return a child process with .promise property.
 * Basically, a spawnCommand wrapper around zoroaster binary.
 * @param {string[]} args An array of strings as arguments
 * @param {object} options Options to pass when creating child process
 * @returns {ChildProcess} An instance of a ChildProcess, with `.promise` property,
 * which will be resolved when tests are finished.
 */
function run(args, options) {
    const proc = spawnCommand(BIN_PATH, args, options)
    return proc
}

module.exports = run
