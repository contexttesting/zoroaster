import { fork } from 'spawncommand'
import { resolve } from 'path'
import stripAnsi from 'strip-ansi'
import SnapshotContext from 'snapshot-context'
import Context from '../context'

const ZOROASTER = process.env.ALAMODE_ENV == 'test-build' ? '../../build/bin' : '../../src/bin/alamode.js'
const BIN = resolve(__dirname, ZOROASTER)

const re = new RegExp(process.cwd().replace(/\\/g, '\\\\'), 'g')
const winRe = new RegExp(process.cwd().replace(/\\/g, '/'), 'g')

function getSnapshot(s) {
  const snapshot = stripAnsi(s).trim()
  return snapshot
    .replace(re, '')
    .replace(winRe, '')
    .replace(/\\/g, '/')
    .replace(/\r?\n/g, '\n')
}

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
const T = {
  context:[
    Context,
    SnapshotContext,
  ],
  async 'produces correct output'({ TEST_SUITE_PATH, SNAPSHOT_DIR }, { test, setDir }) {
    setDir(SNAPSHOT_DIR)
    const { promise } = fork(BIN, [TEST_SUITE_PATH, '-a'], {
      stdio: 'pipe',
    })
    const { stdout } = await promise
    const s = getSnapshot(stdout)
    await test('integration-stdout.txt', s)
  },
}

export default T
