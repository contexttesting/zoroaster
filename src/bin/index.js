#!/usr/bin/env node
import { readdirSync, lstatSync } from 'fs'
import { join, resolve } from 'path'
import TestSuite from '../lib/TestSuite'
import { test } from '../lib/bin'
import argufy from 'argufy'
import { version } from '../../package.json'
import usually from 'usually'

const {
  babel, alamode, watch: _watch, version: _version, help: _help, tests: _tests = [],
} = argufy({
  tests: { command: true, multiple: true },
  babel: { short: 'b', boolean: true },
  alamode: { short: 'a', boolean: true },
  watch: { short: 'w', boolean: true },
  version: { short: 'v', boolean: true },
  help: { short: 'h', boolean: true },
})

if (_version) {
  console.log(version)
  process.exit()
}
if (_help) {
  const usage = usually({
    usage: {
      pathToSpec: 'The path to a test suite file.',
      '-w, --watch': 'Monitor files for changes and re-run tests.',
      '-a, --alamode': 'Require alamode (to enable import/export).',
      '-b, --babel': 'Require babel/register.',
      '-v, --version': 'Print version number and exit.',
      '-h, --help': 'Display this usage information.',
    },
    description: 'A testing framework with support for test contexts.',
    line: 'zoroaster pathToSpec [pathToSpecN] [-w] [-ab] [-vh]',
    example: 'zoroaster test/spec -a',
  })
  console.log(usage)
  process.exit()
}

const replaceFilename = (filename) => {
  return filename.replace(/\.js$/, '')
}

function buildDirectory(dir) {
  const content = readdirSync(dir)
  const res = content.reduce((acc, node) => {
    const path = join(dir, node)
    const stat = lstatSync(path)
    let r
    let name
    if (stat.isFile()) {
      r = resolve(path)
      name = replaceFilename(node)
    } else if (stat.isDirectory()) {
      r = buildDirectory(path)
      name = node
    }
    return {
      ...acc,
      [name]: r,
    }
  }, {})
  return res
}

function parseArgv(argv) {
  const argvPath = resolve(argv)
  try {
    const res = lstatSync(argvPath)
    if (res.isFile()) {
      const ts = new TestSuite(argv, argvPath)
      return ts
    } else if (res.isDirectory()) {
      const dir = buildDirectory(argv)
      const ts = new TestSuite(argv, dir)
      return ts
    }
  } catch (err) {
    // file or directory does not exist
    // eslint-disable-next-line
    console.error(err)
  }
}

const resolveTestSuites = (args) => {
  return args
    // create test suites and remove paths that cannot be resolved
    .map(parseArgv)
    .filter(testSuite => testSuite)
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

const testSuites = resolveTestSuites(_tests)

;(async () => {
  try {
    await test(testSuites, _watch)
  } catch ({ message, stack }) {
    if (process.env.DEBUG) console.log(stack) // eslint-disable-line no-console
    console.error(message) // eslint-disable-line no-console
    process.exit(1)
  }
})()