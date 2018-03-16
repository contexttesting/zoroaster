#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const Catchment = require('catchment')
const { EOL } = require('os')

const TestSuite = require('../src/test_suite')
const lib = require('../src/lib')
const stream = require('../src/stream')

function buildDirectory(dir) {
  const content = fs.readdirSync(dir)
  const res = {}
  content.forEach((node) => {
    const nodePath = path.join(dir, node)
    const stat = fs.lstatSync(nodePath)
    if (stat.isFile()) {
      res[node] = path.resolve(nodePath)
    } else if (stat.isDirectory()) {
      res[node] = buildDirectory(nodePath)
    }
  })
  return res
}

function parseArgv(argv) {
  const argvPath = path.resolve(argv)
  try {
    const res = fs.lstatSync(argvPath)
    if (res.isFile()) {
      return new TestSuite(argv, argvPath)
    } else if (res.isDirectory()) {
      const dir = buildDirectory(argv)
      return new TestSuite(argv, dir)
    }
  } catch (err) {
    // file or directory does not exist
    // eslint-disable-next-line
        console.error(err)
  }
}

function resolveTestSuites(argv) {
  return argv
    .slice(2)
  // ignore flags
    .filter((argv) => {
      return !/^--/.test(argv)
    })
  // create test suites and remove paths that cannot be resolved
    .map(parseArgv)
    .filter(testSuite => testSuite !== undefined)
}

function watchFiles(files, callback) {
  files.forEach((file) => {
    // console.log(`Watching ${file} for changes...`)
    fs.watchFile(file, callback)
  })
}
function unwatchFiles(files) {
  files.forEach((file) => {
    // console.log(`Unwatching ${file}`)
    fs.unwatchFile(file)
  })
}

/**
 * Remove modules cached by require.
 */
function clearRequireCache() {
  Object.keys(require.cache).forEach((key) => {
    delete require.cache[key]
  })
}

function requireTestSuite(ts) {
  return ts.require()
}

function test(testSuites, watch, currentlyWatching) {
  clearRequireCache()
  testSuites
    .forEach(requireTestSuite)

  if (watch) {
    const cw = Array.isArray(currentlyWatching) ? currentlyWatching : []
    unwatchFiles(cw)
    const newCurrentlyWatching = Object.keys(require.cache)
    watchFiles(newCurrentlyWatching, () => test(testSuites, watch, newCurrentlyWatching))
  }

  const testSuiteStackTS = stream.createTestSuiteStackStream()

  const errorTS = stream.createErrorTransformStream()
  const progressTS = stream.createProgressTransformStream()
  testSuiteStackTS.pipe(progressTS).pipe(process.stdout)
  testSuiteStackTS.pipe(errorTS)

  const catchment = new Catchment({ rs: errorTS })

  const count = {
    total: 0,
    error: 0,
  }

  const notify = (data) => {
    if (typeof data !== 'object') return
    testSuiteStackTS.write(data)
    if (data.type === 'test-end') {
      count.total++
      if (data.error) {
        count.error++
      }
    }
  }
  return lib
    .runInSequence(testSuites, notify)
    .then(() => testSuiteStackTS.end())
    .then(() => catchment.promise)
    .then((errorsCatchment) => {
      process.stdout.write(EOL)
      process.stdout.write(errorsCatchment)

      process.stdout.write(`🦅  Executed ${count.total} tests`)
      if (count.error) {
        process.stdout.write(
          `: ${count.error} error${count.error > 1 ? 's' : ''}`
        )
      }
      process.stdout.write(`.${EOL}${EOL}`)

      if (count.error) {
        process.on('exit', () => process.exit(1))
      }
    })
}

const watch = !!process.argv.find(arg => arg === '--watch')

const testSuites = resolveTestSuites(process.argv)
test(testSuites, watch)
