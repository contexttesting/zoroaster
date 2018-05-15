import { fork } from 'spawncommand'
import { resolve, join, basename } from 'path'
import stripAnsi from 'strip-ansi'
import { EOL } from 'os'
import snapshotContext, { SnapshotContext } from 'snapshot-context'
import context, { Context} from '../context'

const SNAPSHOT_DIR = resolve(__dirname, '../snapshot')
const BIN = resolve(__dirname, '../../src/bin')

const re = new RegExp(process.cwd(), 'g')
function getSnapshot(s) {
  const snapshot = stripAnsi(s).trim()
  return snapshot.replace(re, '')
}

// const WIN = /^win/.test(process.platform)

/** @type {Object.<string, (ctx: Context, snapshotCtx: SnapshotContext)>} */
const t = {
  context:[
    context,
    snapshotContext
  ],
  async 'produces correct output'({ TEST_SUITE_PATH }, { test, setDir }) {
    setDir(SNAPSHOT_DIR)
    const { promise } = fork(BIN, [TEST_SUITE_PATH], {
      stdio: 'pipe',
    })
    const { stdout, stderr } = await promise
    await test('integration-stdout.txt', getSnapshot(stdout))
  },
}

export default t
