import { fork } from 'spawncommand'
import { resolve } from 'path'
import stripAnsi from 'strip-ansi'
import snapshotContext from 'snapshot-context'
import context from '../context'
import { SnapshotContext } from 'snapshot-context' // eslint-disable-line
import { Context } from '../context' // eslint-disable-line

const SNAPSHOT_DIR = resolve(__dirname, '../snapshot')
const ZOROASTER = process.env.BABEL_ENV == 'test-build' ? '../../build/bin/zoroaster.js' : '../../src/bin'
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

/** @type {Object.<string, (ctx: Context, snapshotCtx: SnapshotContext)>} */
const T = {
  context:[
    context,
    snapshotContext,
  ],
  async 'produces correct output'({ TEST_SUITE_PATH }, { test, setDir }) {
    setDir(SNAPSHOT_DIR)
    const { promise } = fork(BIN, [TEST_SUITE_PATH, '--babel'], {
      stdio: 'pipe',
    })
    const { stdout } = await promise
    const s = getSnapshot(stdout)
    await test('integration-stdout.txt', s)
  },
}

export default T
