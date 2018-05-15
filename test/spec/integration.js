import { fork } from 'spawncommand'
import { resolve, join, basename } from 'path'
import stripAnsi from 'strip-ansi'
import { EOL } from 'os'
import { parseVersion } from 'noddy'
import snapshotContext, { SnapshotContext } from 'snapshot-context'
import context, { Context} from '../context'

const SNAPSHOT_DIR = resolve(__dirname, '../snapshot')
const BIN = resolve(__dirname, '../../src/bin')

// const testSuiteDir = join(__dirname, '../fixtures')
// const fixturePath = join(testSuiteDir, 'test_suite.js')

// const isEs5 = basename(resolve(__dirname, '../..')) == 'es5'

// const { major: nodeVersion } = parseVersion()

// const WIN = /^win/.test(process.platform)

// let exp
// if (WIN && nodeVersion == 4) {
//   exp = expectedWin4 // es5
// } else if (WIN && nodeVersion == 6) {
//   exp = expectedWin6 // es5
// } else if (/^win/.test(process.platform)) {
//   exp = expectedWin
// } else if (nodeVersion == 8 && isEs5) {
//   exp = expected8Es5
// } else if (nodeVersion == 8) {
//   exp = expected8
// }
// // else if (nodeVersion === 7) {
// //   exp = expected7 // es5
// // }
// else if (nodeVersion == 6) {
//   exp = expected6 // es5
// } else if (nodeVersion == 4) {
//   exp = expected4 // es5
// }
// const expected = exp
//   .replace(/\[fixtures_path\]/g, testSuiteDir)
//   .replace(/\[fixture_path\]/g, fixturePath)
//   .replace(/\[fixture_path_async\]/g, fixturePath.replace(/\\/g, '/'))
//   .replace(/\n/g, EOL)

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
    await test('integration-stdout.txt', stripAnsi(stdout).trim())
    // await test('integration-stderr.txt', `${stderr}`)
  },
}

export default t
