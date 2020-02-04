#!/usr/bin/env node
import cleanStack from '@artdeco/clean-stack'
import { _version, _help, _alamode, _babel, _tests, _argv, _watch, _timeout, _snapshot, _snapshotRoot, _interactive, _environment } from './get-args'
import { resolve } from 'path'
import run from '../lib/run'
import getUsage from './usage'

if (_version) {
  console.log(require('../../package.json').version)
  process.exit()
} else if (_help) {
  const usage = getUsage()
  console.log(usage)
  process.exit()
}

if (_babel) {
  try {
    require(/* ok static-analysis */ '@babel/register')
  } catch (err) {
    const p = resolve(process.cwd(), 'node_modules/@babel/register')
    require(p)
  }
}

if (_alamode) {
  if (_environment) process.env['ALAMODE_ENV'] = _environment
  require(/* ok static-analysis */ 'alamode')()
}

(async () => {
  try {
    await run({
      paths: [..._tests || [], ..._argv],
      watch: _watch,
      timeout: _timeout,
      snapshot: _snapshot,
      snapshotRoot: _snapshotRoot.split(','),
      interactive: _interactive,
    })
  } catch (error) {
    console.log(cleanStack(error.stack)) // eslint-disable-line no-console
    process.exit(1)
  }
})()