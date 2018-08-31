import { watchFile, unwatchFile } from 'fs'
import Catchment from 'catchment'
import { EOL } from 'os'
import {
  createErrorTransformStream,
  createProgressTransformStream,
  createTestSuiteStackStream,
} from './stream'
import { buildTestSuites, clearRequireCache } from './bin'


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
 *
 * @param {string[]} paths Paths to test suites.
 * @param {boolean} [watch] Whether to watch files for changes.
 * @param {string[]} [_currentlyWatching]
 */
export default async function run(paths, watch, _currentlyWatching = []) {
  clearRequireCache()
  const rootTestSuite = await buildTestSuites(paths)

  if (watch) {
    unwatchFiles(_currentlyWatching)
    const newCurrentlyWatching = Object.keys(require.cache)
    watchFiles(newCurrentlyWatching, async () => {
      // we can also re-run only changed test suites
      await run(paths, watch, newCurrentlyWatching)
    })
  }

  const stack = createTestSuiteStackStream()

  const rs = createErrorTransformStream()
  const ts = createProgressTransformStream()
  stack.pipe(ts).pipe(process.stdout)
  stack.pipe(rs)

  const { promise: errorsPromise } = new Catchment({ rs })

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
  await rootTestSuite.runInSequence(notify, rootTestSuite.hasFocused)

  stack.end()
  const errorsCatchment = await errorsPromise
  process.stdout.write(EOL)
  process.stdout.write(errorsCatchment)

  process.stdout.write(`🦅  Executed ${count.total} tests`)
  if (count.error) {
    process.stdout.write(
      `: ${count.error} error${count.error > 1 ? 's' : ''}`
    )
  }
  process.stdout.write(`.${EOL}`)

  process.removeAllListeners('exit')

  process.once('exit', () => process.exit(count.error))
}
