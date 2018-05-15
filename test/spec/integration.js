import { fork } from 'spawncommand'
import { resolve } from 'path'
import stripAnsi from 'strip-ansi'
import snapshotContext, { SnapshotContext } from 'snapshot-context' // eslint-disable-line
import context, { Context } from '../context' // eslint-disable-line

const SNAPSHOT_DIR = resolve(__dirname, '../snapshot')
const BIN = resolve(__dirname, '../../src/bin')

const re = new RegExp(process.cwd().replace(/\\/g, '\\\\'), 'g')
function getSnapshot(s) {
  const snapshot = stripAnsi(s).trim()
  return snapshot.replace(re, '')
}

// const WIN = /^win/.test(process.platform)

/** @type {Object.<string, (ctx: Context, snapshotCtx: SnapshotContext)>} */
const t = {
  context:[
    context,
    snapshotContext,
  ],
  async 'produces correct output'({ TEST_SUITE_PATH }, { test, setDir }) {
    setDir(SNAPSHOT_DIR)
    const { promise } = fork(BIN, [TEST_SUITE_PATH], {
      stdio: 'pipe',
    })
    const { stdout } = await promise
    await test('integration-stdout.txt', getSnapshot(stdout))
  },
}

export default t
