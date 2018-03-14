/**
 * This file is needed to run tests on Windows from package.json.
 */

const { fork } = require('child_process')
const { resolve } = require('path')

const zoroaster = resolve(__dirname, 'bin/zoroaster')
const spec = resolve(__dirname, 'test/spec')

const args = [spec]

if (process.argv.find(argv => argv === '--watch')) {
  args.push('--watch')
}

fork(zoroaster, args)
  .on('exit', process.exit)
