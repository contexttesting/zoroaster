/**
 * This file is needed to run tests on Windows from package.json.
 */

const cp = require('child_process')
const path = require('path')

const zoroaster = path.join(__dirname, 'bin', 'zoroaster')
const spec = path.join(__dirname, 'test', 'spec')

const args = [spec]

if (process.argv.find(argv => argv === '--watch')) {
    args.push('--watch')
}

const fork = cp.fork(zoroaster, args)
fork.on('exit', process.exit)
