require('colors')
const spawnCommand = require('spawncommand')
const { resolve, join } = require('path')
const assert = require('assert')
const jsdiff = require('diff')
const stripAnsi = require('strip-ansi')
const { EOL } = require('os')
const { parseVersion } = require('noddy')

const testSuiteDir = resolve(__dirname, '../fixtures')
const zoroasterBin = resolve(__dirname, '../../bin/zoroaster')
const fixturePath = join(testSuiteDir, 'test_suite.js')

const { major: nodeVersion } = parseVersion()

const expected7 = ` [fixtures_path]
   test_suite.js
   \u001b[32m ✓ \u001b[0m test1
   \u001b[31m ✗ \u001b[0m test2
    | Error: When you are in doubt abstain.
    |     at test2 ([fixture_path]:8:22)
   \u001b[32m ✓ \u001b[0m test3
   \u001b[32m ✓ \u001b[0m test4
   \u001b[32m ✓ \u001b[0m test5
   \u001b[31m ✗ \u001b[0m test6
    | Error: Error from Promise constructor
    |     at Timeout.setTimeout [as _onTimeout] ([fixture_path]:17:16)

\u001b[31m[fixtures_path] > test_suite.js > test2\u001b[0m
  Error: When you are in doubt abstain.
      at test2 ([fixture_path]:8:22)

\u001b[31m[fixtures_path] > test_suite.js > test6\u001b[0m
  Error: Error from Promise constructor
      at Timeout.setTimeout [as _onTimeout] ([fixture_path]:17:16)

Executed 6 tests: 2 errors.

`

const expected6 = ` [fixtures_path]
   test_suite.js
   \u001b[32m ✓ \u001b[0m test1
   \u001b[31m ✗ \u001b[0m test2
    | Error: When you are in doubt abstain.
    |     at test2 ([fixture_path]:8:22)
   \u001b[32m ✓ \u001b[0m test3
   \u001b[32m ✓ \u001b[0m test4
   \u001b[32m ✓ \u001b[0m test5
   \u001b[31m ✗ \u001b[0m test6
    | Error: Error from Promise constructor
    |     at Timeout.setTimeout ([fixture_path]:17:16)

\u001b[31m[fixtures_path] > test_suite.js > test2\u001b[0m
  Error: When you are in doubt abstain.
      at test2 ([fixture_path]:8:22)

\u001b[31m[fixtures_path] > test_suite.js > test6\u001b[0m
  Error: Error from Promise constructor
      at Timeout.setTimeout ([fixture_path]:17:16)

Executed 6 tests: 2 errors.

`

const expected4 = ` [fixtures_path]
   test_suite.js
   \u001b[32m ✓ \u001b[0m test1
   \u001b[31m ✗ \u001b[0m test2
    | Error: When you are in doubt abstain.
    |     at testSuite.test2 ([fixture_path]:8:22)
   \u001b[32m ✓ \u001b[0m test3
   \u001b[32m ✓ \u001b[0m test4
   \u001b[32m ✓ \u001b[0m test5
   \u001b[31m ✗ \u001b[0m test6
    | Error: Error from Promise constructor
    |     at null._onTimeout ([fixture_path]:17:16)

\u001b[31m[fixtures_path] > test_suite.js > test2\u001b[0m
  Error: When you are in doubt abstain.
      at testSuite.test2 ([fixture_path]:8:22)

\u001b[31m[fixtures_path] > test_suite.js > test6\u001b[0m
  Error: Error from Promise constructor
      at null._onTimeout ([fixture_path]:17:16)

Executed 6 tests: 2 errors.

`

const expectedWin = ` [fixtures_path]
   test_suite.js
   \u001b[32m ✓ \u001b[0m test1
   \u001b[31m ✗ \u001b[0m test2
    | Error: When you are in doubt abstain.
    |     at test2 ([fixture_path]:8:22)
   \u001b[32m ✓ \u001b[0m test3
   \u001b[32m ✓ \u001b[0m test4
   \u001b[32m ✓ \u001b[0m test5
   \u001b[31m ✗ \u001b[0m test6
    | Error: Error from Promise constructor
    |     at Timeout.setTimeout [as _onTimeout] ([fixture_path]:17:16)

\u001b[31m[fixtures_path] > test_suite.js > test2\u001b[0m
  Error: When you are in doubt abstain.
      at test2 ([fixture_path]:8:22)

\u001b[31m[fixtures_path] > test_suite.js > test6\u001b[0m
  Error: Error from Promise constructor
      at Timeout.setTimeout [as _onTimeout] ([fixture_path]:17:16)

Executed 6 tests: 2 errors.

`

let exp
if (/^win/.test(process.platform)) {
  exp = expectedWin
} else if (nodeVersion === 8) {
  exp = expected7
} else if (nodeVersion === 7) {
  exp = expected7
} else if (nodeVersion === 6) {
  exp = expected6
} else if (nodeVersion === 4) {
  exp = expected4
}
const expected = exp
  .replace(/\[fixtures_path\]/g, testSuiteDir)
  .replace(/\[fixture_path\]/g, fixturePath)
  .replace(/\n/g, EOL)

const integrationTestSuite = {
  async 'should produce correct output'() {
    let program
    let args
    if (!/^win/.test(process.platform)) { // linux
      program = zoroasterBin
      args = [testSuiteDir]
    } else { // windows
      program = process.env.comspec
      args = ['/c', 'node', zoroasterBin, testSuiteDir]
    }
    const { promise } = spawnCommand(program, args)
    const { stdout } = await promise
    try {
      assert(stdout === expected)
    } catch (err) {
      const diff = jsdiff.diffChars(stripAnsi(expected), stripAnsi(stdout))
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
