#!/usr/bin/env node
var fs = require('fs');

var _require = require('path'),
    join = _require.join,
    resolve = _require.resolve;

var Catchment = require("catchment/es5");

var _require2 = require('os'),
    EOL = _require2.EOL;

var TestSuite = require('../src/test_suite');

var lib = require('../src/lib');

var stream = require('../src/stream');

function buildDirectory(dir) {
  var content = fs.readdirSync(dir);
  var res = {};
  content.forEach(function (node) {
    var nodePath = join(dir, node);
    var stat = fs.lstatSync(nodePath);

    if (stat.isFile()) {
      res[node] = resolve(nodePath);
    } else if (stat.isDirectory()) {
      res[node] = buildDirectory(nodePath);
    }
  });
  return res;
}

function parseArgv(argv) {
  var argvPath = resolve(argv);

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
    return testSuite;
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

function test(testSuites, watch) {
  var $args = arguments;
  return new Promise(function ($return, $error) {
    var currentlyWatching, newCurrentlyWatching, stack, rs, ts, catchment, count, notify, errorsCatchment;
    currentlyWatching = $args.length > 2 && $args[2] !== undefined ? $args[2] : [];
    clearRequireCache();
    testSuites.forEach(requireTestSuite);

    if (watch) {
      unwatchFiles(currentlyWatching);
      newCurrentlyWatching = Object.keys(require.cache);
      watchFiles(newCurrentlyWatching, function () {
        return test(testSuites, watch, newCurrentlyWatching);
      });
    }

    stack = stream.createTestSuiteStackStream();
    rs = stream.createErrorTransformStream();
    ts = stream.createProgressTransformStream();
    stack.pipe(ts).pipe(process.stdout);
    stack.pipe(rs);
    catchment = new Catchment({
      rs
    });
    count = {
      total: 0,
      error: 0
    };

    notify = function notify(data) {
      if (typeof data !== 'object') return;
      stack.write(data);

      if (data.type == 'test-end') {
        count.total++;

        if (data.error) {
          count.error++;
        }
      }
    };

    return Promise.resolve(lib.runInSequence(testSuites, notify)).then(function ($await_4) {
      try {
        stack.end();
        return Promise.resolve(catchment.promise).then(function ($await_5) {
          try {
            errorsCatchment = $await_5;
            process.stdout.write(EOL);
            process.stdout.write(errorsCatchment);
            process.stdout.write(`🦅  Executed ${count.total} tests`);

            if (count.error) {
              process.stdout.write(`: ${count.error} error${count.error > 1 ? 's' : ''}`);
            }

            process.stdout.write(`.${EOL}`);
            process.on('exit', function () {
              return process.exit(count.error);
            });
            return $return();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this), $error);
  }.bind(this));
}

var watch = process.argv.some(function (a) {
  return a == '--watch';
});
var babel = process.argv.some(function (a) {
  return a == '--babel';
});

if (babel) {
  try {
    require('@babel/register');
  } catch (err) {
    var p = resolve(process.cwd(), 'node_modules/@babel/register');

    require(p);
  }
}

var testSuites = resolveTestSuites(process.argv);

(function () {
  return new Promise(function ($return, $error) {
    var message;

    var $Try_3_Post = function () {
      try {
        return $return();
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this);

    var $Try_3_Catch = function (_ref) {
      try {
        message = _ref.message;
        console.error(message);
        process.exit(1);
        return $Try_3_Post();
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this);

    try {
      return Promise.resolve(test(testSuites, watch)).then(function ($await_6) {
        try {
          return $Try_3_Post();
        } catch ($boundEx) {
          return $Try_3_Catch($boundEx);
        }
      }.bind(this), $Try_3_Catch);
    } catch (_ref) {
      $Try_3_Catch(_ref)
    }
  }.bind(this));
})();