require('colors')
const spawnCommand = require('spawncommand')
const { resolve, join } = require('path')
const { equal } = require('assert')
const jsdiff = require('diff')
const stripAnsi = require('strip-ansi')
const { EOL } = require('os')
const { parseVersion } = require('noddy')
const expectedWin = require('../snapshot/win')
const expectedWin4 = require('../snapshot/win-4')
const expected8 = require('../snapshot/node-8')
const expected6 = require('../snapshot/node-6')
const expected4 = require('../snapshot/node-4')

const testSuiteDir = join(__dirname, '../fixtures')
const fixturePath = join(testSuiteDir, 'test_suite.js')
const zoroasterBin = resolve(__dirname, '../../bin/zoroaster.js')

const { major: nodeVersion } = parseVersion()

const WIN = /^win/.test(process.platform)

let exp
if (WIN && nodeVersion === 4) {
  exp = expectedWin4 // es5
} else if (/^win/.test(process.platform)) {
  exp = expectedWin
} else if (nodeVersion === 8) {
  exp = expected8
}
// else if (nodeVersion === 7) {
//   exp = expected7 // es5
// }
else if (nodeVersion === 6) {
  exp = expected6 // es5
} else if (nodeVersion === 4) {
  exp = expected4 // es5
}
const expected = exp
  .replace(/\[fixtures_path\]/g, testSuiteDir)
  .replace(/\[fixture_path\]/g, fixturePath)
  .replace(/\[fixture_path_async\]/g, fixturePath.replace(/\\/g, '/'))
  .replace(/\n/g, EOL)

const integrationTestSuite = {
  async 'should produce correct output'() {
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
    try {
      equal(actual, expected)
    } catch (err) {
      const diff = jsdiff.diffChars(stripAnsi(actual), stripAnsi(expected))
      diff.forEach((part) => {
        var color = part.added ? 'green' :
          part.removed ? 'red' : 'grey'
        process.stderr.write(part.value[color])
      })

      throw new Error('Result did not match expected')
    }
  },
}

module.exports = integrationTestSuite
