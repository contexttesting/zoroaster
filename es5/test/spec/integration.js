require('colors');

var spawnCommand = require('spawncommand');

var _require = require('path'),
    resolve = _require.resolve,
    join = _require.join,
    basename = _require.basename;

var _require2 = require('assert'),
    equal = _require2.equal;

var jsdiff = require('diff');

var stripAnsi = require('strip-ansi');

var _require3 = require('os'),
    EOL = _require3.EOL;

var _require4 = require("noddy/es5"),
    parseVersion = _require4.parseVersion;

var expectedWin = require('../snapshot/win');

var expectedWin4 = require('../snapshot/win-4');

var expected8 = require('../snapshot/node-8'); // source


var expected6 = require('../snapshot/node-6'); // es5


var expected4 = require('../snapshot/node-4'); // es5


var expected8Es5 = require('../snapshot/node-8es5');

var testSuiteDir = join(__dirname, '../fixtures');
var fixturePath = join(testSuiteDir, 'test_suite.js');
var zoroasterBin = resolve(__dirname, '../../bin/zoroaster.js');
var isEs5 = basename(resolve(__dirname, '../..')) == 'es5';

var _parseVersion = parseVersion(),
    nodeVersion = _parseVersion.major;

var WIN = /^win/.test(process.platform);
var exp;

if (WIN && nodeVersion == 4) {
  exp = expectedWin4; // es5
} else if (/^win/.test(process.platform)) {
  exp = expectedWin;
} else if (nodeVersion == 8 && isEs5) {
  exp = expected8Es5;
} else if (nodeVersion == 8) {
  exp = expected8;
} // else if (nodeVersion === 7) {
//   exp = expected7 // es5
// }
else if (nodeVersion == 6) {
    exp = expected6; // es5
  } else if (nodeVersion == 4) {
    exp = expected4; // es5
  }

var expected = exp.replace(/\[fixtures_path\]/g, testSuiteDir).replace(/\[fixture_path\]/g, fixturePath).replace(/\[fixture_path_async\]/g, fixturePath.replace(/\\/g, '/')).replace(/\n/g, EOL);
var integrationTestSuite = {
  'should produce correct output'() {
    return new Promise(function ($return, $error) {
      var program, args, _spawnCommand, promise, _ref, actual, diff;

      if (!/^win/.test(process.platform)) {
        // linux
        program = zoroasterBin;
        args = [testSuiteDir];
      } else {
        // windows
        program = process.env.comspec; // just use fork

        args = ['/c', 'node', zoroasterBin, testSuiteDir];
      }

      _spawnCommand = spawnCommand(program, args), promise = _spawnCommand.promise;
      return Promise.resolve(promise).then(function ($await_2) {
        try {
          _ref = $await_2, actual = _ref.stdout;

          try {
            equal(actual, expected);
          } catch (err) {
            diff = jsdiff.diffChars(stripAnsi(actual), stripAnsi(expected));
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