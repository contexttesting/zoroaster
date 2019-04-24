#!/usr/bin/env node
let cleanStack = require('@artdeco/clean-stack'); if (cleanStack && cleanStack.__esModule) cleanStack = cleanStack.default;
const { _version, _help, _alamode, _babel, _tests, _argv, _watch, _timeout, _snapshot, _snapshotRoot, _interactive, argsConfig } = require('./get-args');
const { reduceUsage } = require('argufy');
const { resolve } = require('path');
const run = require('../lib/run');
const getUsage = require('./usage');
const { version } = require('../../package.json');

if (_version) {
  console.log(version)
  process.exit()
} else if (_help) {
  const usage = getUsage(reduceUsage(argsConfig))
  console.log(usage)
  process.exit()
}

if (_babel) {
  try {
    require('@babel/register')
  } catch (err) {
    const p = resolve(process.cwd(), 'node_modules/@babel/register')
    require(p)
  }
}

if (_alamode) {
  require('alamode')()
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