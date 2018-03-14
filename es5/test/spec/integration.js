require('colors');

var spawnCommand = require('spawncommand');

var _require = require('path'),
    resolve = _require.resolve,
    join = _require.join;

var assert = require('assert');

var jsdiff = require('diff');

var stripAnsi = require('strip-ansi');

var _require2 = require('os'),
    EOL = _require2.EOL;

var _require3 = require('noddy'),
    parseVersion = _require3.parseVersion;

var testSuiteDir = join(__dirname, '../fixtures');
var fixturePath = join(testSuiteDir, 'test_suite.js');
var zoroasterBin = resolve(__dirname, '../../bin/zoroaster.js');

var _parseVersion = parseVersion(),
    nodeVersion = _parseVersion.major;

var expected7 = ` [fixtures_path]
   test_suite.js
   \u001b[32m ✓ \u001b[0m test1
   \u001b[31m ✗ \u001b[0m test2
    | Error: When you are in doubt abstain.
    |     at test2 ([fixture_path]:10:11)
   \u001b[32m ✓ \u001b[0m test3
   \u001b[32m ✓ \u001b[0m test4
   \u001b[32m ✓ \u001b[0m test5
   \u001b[31m ✗ \u001b[0m test6
    | Error: Error from Promise constructor
    |     at Timeout._onTimeout ([fixture_path]:41:25)

\u001b[31m[fixtures_path] > test_suite.js > test2\u001b[0m
  Error: When you are in doubt abstain.
      at test2 ([fixture_path]:10:11)

\u001b[31m[fixtures_path] > test_suite.js > test6\u001b[0m
  Error: Error from Promise constructor
      at Timeout._onTimeout ([fixture_path]:41:25)

Executed 6 tests: 2 errors.

`;
var expected6 = ` [fixtures_path]
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

`;
var expected4 = ` [fixtures_path]
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

`;
var expectedWin = ` [fixtures_path]
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
    |     at Timeout.setTimeout [as _onTimeout] ([fixture_path_async]:17:16)

\u001b[31m[fixtures_path] > test_suite.js > test2\u001b[0m
  Error: When you are in doubt abstain.
      at test2 ([fixture_path]:8:22)

\u001b[31m[fixtures_path] > test_suite.js > test6\u001b[0m
  Error: Error from Promise constructor
      at Timeout.setTimeout [as _onTimeout] ([fixture_path_async]:17:16)

Executed 6 tests: 2 errors.

`;
var exp;

if (/^win/.test(process.platform)) {
  exp = expectedWin;
} else if (nodeVersion === 8) {
  exp = expected7;
} else if (nodeVersion === 7) {
  exp = expected7;
} else if (nodeVersion === 6) {
  exp = expected6;
} else if (nodeVersion === 4) {
  exp = expected4;
}

var expected = exp.replace(/\[fixtures_path\]/g, testSuiteDir).replace(/\[fixture_path\]/g, fixturePath).replace(/\[fixture_path_async\]/g, fixturePath.replace(/\\/g, '/')).replace(/\n/g, EOL);
var integrationTestSuite = {
  'should produce correct output'() {
    return new Promise(function ($return, $error) {
      var program, args, _spawnCommand, promise, _ref, stdout, diff;

      if (!/^win/.test(process.platform)) {
        // linux
        program = zoroasterBin;
        args = [testSuiteDir];
      } else {
        // windows
        program = process.env.comspec;
        args = ['/c', 'node', zoroasterBin, testSuiteDir];
      }

      _spawnCommand = spawnCommand(program, args), promise = _spawnCommand.promise;
      return Promise.resolve(promise).then(function ($await_2) {
        try {
          _ref = $await_2, stdout = _ref.stdout;

          try {
            assert(stdout === expected);
          } catch (err) {
            diff = jsdiff.diffChars(stripAnsi(expected), stripAnsi(stdout));
            diff.forEach(function (part) {
              var color = part.added ? 'green' : part.removed ? 'red' : 'grey';
              process.stderr.write(part.value[color]);
            });
            throw new Error('Result did not match expected');
          }

          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

};
module.exports = integrationTestSuite;
