import { readdirSync, lstatSync, watchFile, unwatchFile } from 'fs'
import { join, resolve } from 'path'
import Catchment from 'catchment'
import { EOL } from 'os'
import TestSuite from '../lib/TestSuite'
import { runInSequence } from '../lib'
import { createErrorTransformStream, createProgressTransformStream, createTestSuiteStackStream } from '../lib/stream'

const replaceFilename = (filename) => {
  return filename.replace(/\.js$/, '')
}

function buildDirectory(dir) {
  const content = readdirSync(dir)
  const res = content.reduce((acc, node) => {
    const path = join(dir, node)
    const stat = lstatSync(path)
    let res
    let name
    if (stat.isFile()) {
      res = resolve(path)
      name = replaceFilename(node)
    } else if (stat.isDirectory()) {
      res = buildDirectory(path)
      name = node
    }
    return {
      ...acc,
      [name]: res,
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

function resolveTestSuites(argv) {
  return argv
    .slice(2)
  // ignore flags
    .filter((argv) => {
      return !/^--/.test(argv)
    })
  // create test suites and remove paths that cannot be resolved
    .map(parseArgv)
    .filter(testSuite => testSuite)
}

function watchFiles(files, callback) {
  files.forEach((file) => {
    // console.log(`Watching ${file} for changes...`)
    watchFile(file, callback)
  })
}
function unwatchFiles(files) {
  files.forEach((file) => {
    // console.log(`Unwatching ${file}`)
    unwatchFile(file)
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

async function test(testSuites, watch, currentlyWatching = []) {
  clearRequireCache()
  testSuites
    .forEach(requireTestSuite)

  if (watch) {
    unwatchFiles(currentlyWatching)
    const newCurrentlyWatching = Object.keys(require.cache)
    watchFiles(newCurrentlyWatching, () => test(testSuites, watch, newCurrentlyWatching))
  }

  const stack = createTestSuiteStackStream()

  const rs = createErrorTransformStream()
  const ts = createProgressTransformStream()
  stack.pipe(ts).pipe(process.stdout)
  stack.pipe(rs)

  const catchment = new Catchment({ rs })

  const count = {
    total: 0,
    error: 0,
  }

  const notify = (data) => {
    if (typeof data != 'object') return
    stack.write(data)
    if (data.type == 'test-end') {
      count.total++
      if (data.error) {
        count.error++
      }
    }
  }
  await runInSequence(testSuites, notify)
  stack.end()
  const errorsCatchment = await catchment.promise
  process.stdout.write(EOL)
  process.stdout.write(errorsCatchment)

  process.stdout.write(`🦅  Executed ${count.total} tests`)
  if (count.error) {
    process.stdout.write(
      `: ${count.error} error${count.error > 1 ? 's' : ''}`
    )
  }
  process.stdout.write(`.${EOL}`)

  process.on('exit', () => process.exit(count.error))
}

const watch = process.argv.some(a => a == '--watch')
const babel = process.argv.some(a => a == '--babel')

if (babel) {
  try {
    require('@babel/register')
  } catch (err) {
    const p = resolve(process.cwd(), 'node_modules/@babel/register')
    require(p)
  }
}

const testSuites = resolveTestSuites(process.argv)

;(async () => {
  try {
    await test(testSuites, watch)
  } catch ({ message, stack }) {
    if (process.env.DEBUG) console.log(stack) // eslint-disable-line no-console
    console.error(message) // eslint-disable-line no-console
    process.exit(1)
  }
})()
