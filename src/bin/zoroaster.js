#!/usr/bin/env node
import cleanStack from '@artdeco/clean-stack'
import argufy from 'argufy'
import { resolve } from 'path'
import run from '../lib/run'
import getUsage from './usage'
import { version } from '../../package.json'

const {
  babel,
  alamode,
  watch: _watch,
  version: _version,
  help: _help,
  paths: _paths = [],
  timeout: _timeout = 2000,
  snapshot = 'test/snapshot',
  snapshotRoot = 'test/spec,test/mask',
  interactive = false,
  _argv,
} = argufy({
  paths: { command: true, multiple: true },
  babel: { short: 'b', boolean: true },
  alamode: { short: 'a', boolean: true },
  watch: { short: 'w', boolean: true },
  version: { short: 'v', boolean: true },
  help: { short: 'h', boolean: true },
  timeout: { short: 't', number: true },
  snapshot: { short: 's' },
  snapshotRoot: { short: 'r' },
  interactive: { short: 'i', boolean: true },
})

if (_version) {
  console.log(version)
  process.exit()
} else if (_help) {
  const usage = getUsage()
  console.log(usage)
  process.exit()
}

if (babel) {
  try {
    require('@babel/register')
  } catch (err) {
    const p = resolve(process.cwd(), 'node_modules/@babel/register')
    require(p)
  }
}

if (alamode) {
  require('alamode')()
}

(async () => {
  try {
    await run({
      paths: [..._paths, ..._argv],
      watch: _watch,
      timeout: _timeout,
      snapshot,
      snapshotRoot: snapshotRoot.split(','),
      interactive,
    })
  } catch ({ stack }) {
    console.log(cleanStack(stack)) // eslint-disable-line no-console
    process.exit(1)
  }
})()