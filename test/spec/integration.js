'use strict'

require('colors')
const spawnCommand = require('spawncommand')
const path = require('path')
const assert = require('assert')
const jsdiff = require('diff')

const EOL = require('os').EOL

const testSuiteDir = path.resolve(path.join(__dirname, '../fixtures'))
const fixturePath = path.join(testSuiteDir, 'test_suite.js')
const zoroasterBin = path.join(__dirname, '../../bin/zoroaster')

let nodeVersion
if (process.version.startsWith('v4')) {
    nodeVersion = 4
}
if (process.version.startsWith('v6')) {
    nodeVersion = 6
}
if (process.version.startsWith('v7')) {
    nodeVersion = 7
}

const expected7 = ` [fixtures_path]
   test_suite.js
   \u001b[32m ✓ \u001b[0m test1
   \u001b[31m ✗ \u001b[0m test2
    | Error: When you are in doubt abstain.
    |     at test2 ([fixture_path]:8:29)
   \u001b[32m ✓ \u001b[0m test3
   \u001b[32m ✓ \u001b[0m test4
   \u001b[32m ✓ \u001b[0m test5
   \u001b[31m ✗ \u001b[0m test6
    | Error: Error from Promise constructor
    |     at Timeout.setTimeout [as _onTimeout] ([fixture_path]:16:20)

\u001b[31m[fixtures_path] > test_suite.js > test2\u001b[0m
  Error: When you are in doubt abstain.
      at test2 ([fixture_path]:8:29)

\u001b[31m[fixtures_path] > test_suite.js > test6\u001b[0m
  Error: Error from Promise constructor
      at Timeout.setTimeout [as _onTimeout] ([fixture_path]:16:20)

Executed 6 tests: 2 errors.

`

const expected6 = ` [fixtures_path]
   test_suite.js
   \u001b[32m ✓ \u001b[0m test1
   \u001b[31m ✗ \u001b[0m test2
    | Error: When you are in doubt abstain.
    |     at test2 ([fixture_path]:8:29)
   \u001b[32m ✓ \u001b[0m test3
   \u001b[32m ✓ \u001b[0m test4
   \u001b[32m ✓ \u001b[0m test5
   \u001b[31m ✗ \u001b[0m test6
    | Error: Error from Promise constructor
    |     at Timeout.setTimeout ([fixture_path]:16:20)

\u001b[31m[fixtures_path] > test_suite.js > test2\u001b[0m
  Error: When you are in doubt abstain.
      at test2 ([fixture_path]:8:29)

\u001b[31m[fixtures_path] > test_suite.js > test6\u001b[0m
  Error: Error from Promise constructor
      at Timeout.setTimeout ([fixture_path]:16:20)

Executed 6 tests: 2 errors.

`

const expected4 = ` [fixtures_path]
   test_suite.js
   \u001b[32m ✓ \u001b[0m test1
   \u001b[31m ✗ \u001b[0m test2
    | Error: When you are in doubt abstain.
    |     at testSuite.test2 ([fixture_path]:8:29)
   \u001b[32m ✓ \u001b[0m test3
   \u001b[32m ✓ \u001b[0m test4
   \u001b[32m ✓ \u001b[0m test5
   \u001b[31m ✗ \u001b[0m test6
    | Error: Error from Promise constructor
    |     at null._onTimeout ([fixture_path]:16:20)

\u001b[31m[fixtures_path] > test_suite.js > test2\u001b[0m
  Error: When you are in doubt abstain.
      at testSuite.test2 ([fixture_path]:8:29)

\u001b[31m[fixtures_path] > test_suite.js > test6\u001b[0m
  Error: Error from Promise constructor
      at null._onTimeout ([fixture_path]:16:20)

Executed 6 tests: 2 errors.

`

const expectedWin = ` [fixtures_path]
   test_suite.js
   \u001b[32m ✓ \u001b[0m test1
   \u001b[31m ✗ \u001b[0m test2
    | Error: When you are in doubt abstain.
    |     at test2 ([fixture_path]:8:29)
   \u001b[32m ✓ \u001b[0m test3
   \u001b[32m ✓ \u001b[0m test4
   \u001b[32m ✓ \u001b[0m test5
   \u001b[31m ✗ \u001b[0m test6
    | Error: Error from Promise constructor
    |     at Timeout.setTimeout ([fixture_path]:16:20)

\u001b[31m[fixtures_path] > test_suite.js > test2\u001b[0m
  Error: When you are in doubt abstain.
      at test2 ([fixture_path]:8:29)

\u001b[31m[fixtures_path] > test_suite.js > test6\u001b[0m
  Error: Error from Promise constructor
      at Timeout.setTimeout ([fixture_path]:16:20)

Executed 6 tests: 2 errors.

`

let exp
if (/^win/.test(process.platform)) {
    exp = expectedWin
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
    'should produce correct output': () => {
        let program
        let args
        if (!/^win/.test(process.platform)) { // linux
            program = zoroasterBin
            args = [testSuiteDir]
        } else { // windows
            program = process.env.comspec
            args = ['/c', 'node', zoroasterBin, testSuiteDir]
        }
        const zoroaster = spawnCommand(program, args)
        return zoroaster.promise
            .then(res => {
                try {
                    assert(res.stdout === expected)
                } catch (err) {
                    throw new Error(res.stdout)
                }
            })
            .catch((err) => {
                // console.log('Received:')
                // console.log(err.message)
                // console.log('Expected:')
                // console.log(expected)
                const diff = jsdiff.diffChars(expected, err.message)
                diff.forEach((part) => {
                    void part
                    // if (part.added) console.log('+', { v: part.value })
                    // if (part.removed) console.log('-', { v: part.value })
                    // console.log(part.value)
                    // const color =
                    //     part.added ? '+' :
                    //     part.removed ? '-' : ''
                    // process.stderr.write(`[${color}${part.value}${color}]`)
                })
                // console.log()
                throw new Error('Result did not match expected')
            })
    },
}

module.exports = integrationTestSuite
