#!/usr/bin/env node
import { resolve } from 'path'
import run from '../lib/run'
import argufy from 'argufy'
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
} = argufy({
  paths: { command: true, multiple: true },
  babel: { short: 'b', boolean: true },
  alamode: { short: 'a', boolean: true },
  watch: { short: 'w', boolean: true },
  version: { short: 'v', boolean: true },
  help: { short: 'h', boolean: true },
  timeout: { short: 't', number: true },
})

if (_version) {
  console.log(version)
  process.exit()
}
if (_help) {
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
      paths: _paths,
      watch: _watch,
      timeout: _timeout,
    })
  } catch ({ message, stack }) {
    if (process.env.DEBUG) console.log(stack) // eslint-disable-line no-console
    console.error(message) // eslint-disable-line no-console
    process.exit(1)
  }
})()