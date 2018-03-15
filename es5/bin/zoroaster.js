#!/usr/bin/env node
var fs = require('fs');

var path = require('path');

var Catchment = require("catchment/es5");

var _require = require('os'),
    EOL = _require.EOL;

var TestSuite = require('../src/test_suite');

var lib = require('../src/lib');

var stream = require('../src/stream');

function buildDirectory(dir) {
  var content = fs.readdirSync(dir);
  var res = {};
  content.forEach(function (node) {
    var nodePath = path.join(dir, node);
    var stat = fs.lstatSync(nodePath);

    if (stat.isFile()) {
      res[node] = path.resolve(nodePath);
    } else if (stat.isDirectory()) {
      res[node] = buildDirectory(nodePath);
    }
  });
  return res;
}

function parseArgv(argv) {
  var argvPath = path.resolve(argv);

  try {
    var res = fs.lstatSync(argvPath);

    if (res.isFile()) {
      return new TestSuite(argv, argvPath);
    } else if (res.isDirectory()) {
      var dir = buildDirectory(argv);
      return new TestSuite(argv, dir);
    }
  } catch (err) {
    // file or directory does not exist
    // eslint-disable-next-line
    console.error(err);
  }
}

function resolveTestSuites(argv) {
  return argv.slice(2) // ignore flags
  .filter(function (argv) {
    return !/^--/.test(argv);
  }) // create test suites and remove paths that cannot be resolved
  .map(parseArgv).filter(function (testSuite) {
    return testSuite !== undefined;
  });
}

function watchFiles(files, callback) {
  files.forEach(function (file) {
    // console.log(`Watching ${file} for changes...`)
    fs.watchFile(file, callback);
  });
}

function unwatchFiles(files) {
  files.forEach(function (file) {
    // console.log(`Unwatching ${file}`)
    fs.unwatchFile(file);
  });
}
/**
 * Remove modules cached by require.
 */


function clearRequireCache() {
  Object.keys(require.cache).forEach(function (key) {
    delete require.cache[key];
  });
}

function requireTestSuite(ts) {
  return ts.require();
}

function test(testSuites, watch, currentlyWatching) {
  clearRequireCache();
  testSuites.forEach(requireTestSuite);

  if (watch) {
    var cw = Array.isArray(currentlyWatching) ? currentlyWatching : [];
    unwatchFiles(cw);
    var newCurrentlyWatching = Object.keys(require.cache);
    watchFiles(newCurrentlyWatching, function () {
      return test(testSuites, watch, newCurrentlyWatching);
    });
  }

  var testSuiteStackTS = stream.createTestSuiteStackStream();
  var errorTS = stream.createErrorTransformStream();
  var progressTS = stream.createProgressTransformStream();
  testSuiteStackTS.pipe(progressTS).pipe(process.stdout);
  testSuiteStackTS.pipe(errorTS);
  var catchment = new Catchment({
    rs: errorTS
  });
  var count = {
    total: 0,
    error: 0
  };

  var notify = function notify(data) {
    if (typeof data !== 'object') return;
    testSuiteStackTS.write(data);

    if (data.type === 'test-end') {
      count.total++;

      if (data.error) {
        count.error++;
      }
    }
  };

  return lib.runInSequence(testSuites, notify).then(function () {
    return testSuiteStackTS.end();
  }).then(function () {
    return catchment.promise;
  }).then(function (errorsCatchment) {
    process.stdout.write(EOL);
    process.stdout.write(errorsCatchment);
    process.stdout.write(`Executed ${count.total} tests`);

    if (count.error) {
      process.stdout.write(`: ${count.error} error${count.error > 1 ? 's' : ''}`);
    }

    process.stdout.write(`.${EOL}${EOL}`);

    if (count.error) {
      process.on('exit', function () {
        return process.exit(1);
      });
    }
  });
}

var watch = !!process.argv.find(function (arg) {
  return arg === '--watch';
});
var testSuites = resolveTestSuites(process.argv);
test(testSuites, watch);