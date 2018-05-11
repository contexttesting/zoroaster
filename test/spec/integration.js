import spawnCommand from 'spawncommand'
import { resolve, join, basename } from 'path'
import stripAnsi from 'strip-ansi'
import { EOL } from 'os'
import { parseVersion } from 'noddy'
import expectedWin from '../snapshot/win'
import expectedWin4 from '../snapshot/win-4'
import expectedWin6 from '../snapshot/win-6'
import expected8 from '../snapshot/node-8' // source
import expected6 from '../snapshot/node-6' // es5
import expected4 from '../snapshot/node-4' // es5
import expected8Es5 from '../snapshot/node-8es5'
import context, { SnapshotContext } from 'snapshot-context'

const SNAPSHOT_DIR = resolve(__dirname, '../snapshot')

const testSuiteDir = join(__dirname, '../fixtures')
const fixturePath = join(testSuiteDir, 'test_suite.js')
const zoroasterBin = resolve(__dirname, '../../bin/zoroaster.js')

const isEs5 = basename(resolve(__dirname, '../..')) == 'es5'

const { major: nodeVersion } = parseVersion()

const WIN = /^win/.test(process.platform)

let exp
if (WIN && nodeVersion == 4) {
  exp = expectedWin4 // es5
} else if (WIN && nodeVersion == 6) {
  exp = expectedWin6 // es5
} else if (/^win/.test(process.platform)) {
  exp = expectedWin
} else if (nodeVersion == 8 && isEs5) {
  exp = expected8Es5
} else if (nodeVersion == 8) {
  exp = expected8
}
// else if (nodeVersion === 7) {
//   exp = expected7 // es5
// }
else if (nodeVersion == 6) {
  exp = expected6 // es5
} else if (nodeVersion == 4) {
  exp = expected4 // es5
}
const expected = exp
  .replace(/\[fixtures_path\]/g, testSuiteDir)
  .replace(/\[fixture_path\]/g, fixturePath)
  .replace(/\[fixture_path_async\]/g, fixturePath.replace(/\\/g, '/'))
  .replace(/\n/g, EOL)

/** @type {Object.<string, (ctx: SnapshotContext)>} */
const t = {
  context,
  async 'should produce correct output'(ctx) {
    ctx.setDir(SNAPSHOT_DIR)
    let program
    let args
    if (!/^win/.test(process.platform)) { // linux
      program = zoroasterBin
      args = [testSuiteDir]
    } else { // windows
      program = process.env.comspec // just use fork
      args = ['/c', 'node', zoroasterBin, testSuiteDir]
    }
    const { promise } = spawnCommand(program, args)
    const { stdout: actual } = await promise

    await ctx.test('integration.txt', stripAnsi(actual).trim())


    // try {
    //   equal(actual, expected)
    // } catch (err) {
    //   const diff = jsdiff.diffChars(stripAnsi(actual), stripAnsi(expected))
    //   diff.forEach((part) => {
    //     var color = part.added ? 'green' :
    //       part.removed ? 'red' : 'grey'

    //     const p = part.added || part.removed ? part.value.replace(/ /g, '_') : part.value
    //     process.stderr.write(p[color])
    //   })

    //   throw new Error('Result did not match expected')
    // }
  },
}

export default t
