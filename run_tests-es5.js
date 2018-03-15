/**
 * This file helps to run tests on Windows, as well as chooses to test ES5 for
 * Node < 8.6.0. Normal ES7 code is tested with Node 8.6+. The default binary
 * is actual source code, i.e. no transpilation, and es5 binary can be run with
 * zoroaster-es5
 */

import { fork } from 'child_process'
import { resolve } from 'path'
import { nodeLt } from 'noddy'
import { bin } from './package.json'

const { zoroaster, zoroasterEs5 } = bin

const force = process.argv.some(a => a === '--force')
const useEs5 = nodeLt('v8.6.0') || force

if (force) {
  console.log(`Using the force to summon the dead with ${zoroasterEs5}...`) // eslint-disable-line no-console
} else if (useEs5) {
  console.log(`Going down with ${zoroasterEs5}...`) // eslint-disable-line no-console
} else {
  console.log(`Thus spoke Zarathustra ${zoroaster}`) // eslint-disable-line no-console
}

const ZOROASTER = resolve(__dirname, zoroaster)
const ZOROASTER_ES5 = resolve(__dirname, zoroasterEs5)

const SPEC = resolve(__dirname, 'test/spec')
const SPEC_ES5 = resolve(__dirname, 'es5/test/spec')

const spec = useEs5 ? SPEC_ES5 : SPEC
const node = useEs5 ? ZOROASTER_ES5 : ZOROASTER

const args = [spec]

if (process.argv.find(argv => argv === '--watch')) {
  args.push('--watch')
}

fork(node, args)
  .on('exit', process.exit)
