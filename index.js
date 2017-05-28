const path = require('path')
const spawnCommand = require('spawncommand')

const BIN_PATH = path.join(__dirname, 'bin/zoroaster')

function getSpawnOptions(bin, _args) {
    'use strict'
    let program
    let args = Array.isArray(_args) ? _args : []
    if (!/^win/.test(process.platform)) { // linux
        program = bin
    } else { // windows
        program = process.env.comspec
        args = [].concat(['/c', 'node', bin], args)
    }
    return { program, args }
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
    const spawnOptions = getSpawnOptions(BIN_PATH, args)
    const proc = spawnCommand(spawnOptions.program, spawnOptions.args, options)
    return proc
}

module.exports = run
