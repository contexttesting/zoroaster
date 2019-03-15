#!/usr/bin/env node
let cleanStack = require('@artdeco/clean-stack'); if (cleanStack && cleanStack.__esModule) cleanStack = cleanStack.default;
let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;
const { resolve } = require('path');
const run = require('../lib/run');
const getUsage = require('./usage');
const { version } = require('../../package.json');

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
      paths: [..._paths, ..._argv],
      watch: _watch,
      timeout: _timeout,
      snapshot,
      snapshotRoot: snapshotRoot.split(','),
    })
  } catch ({ stack }) {
    console.log(cleanStack(stack)) // eslint-disable-line no-console
    process.exit(1)
  }
})()