"use strict";

var _fs = require("fs");

var _path = require("path");

var _catchment = _interopRequireDefault(require("catchment"));

var _os = require("os");

var _TestSuite = _interopRequireDefault(require("../lib/TestSuite"));

var _lib = require("../lib");

var _stream = require("../lib/stream");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const watchFlags = ['--watch', '-w'];
const babelFlags = ['--babel', '-b'];
const allFlags = [...watchFlags, ...babelFlags];

const replaceFilename = filename => {
  return filename.replace(/\.js$/, '');
};

function buildDirectory(dir) {
  const content = (0, _fs.readdirSync)(dir);
  const res = content.reduce((acc, node) => {
    const path = (0, _path.join)(dir, node);
    const stat = (0, _fs.lstatSync)(path);
    let r;
    let name;

    if (stat.isFile()) {
      r = (0, _path.resolve)(path);
      name = replaceFilename(node);
    } else if (stat.isDirectory()) {
      r = buildDirectory(path);
      name = node;
    }

    return _objectSpread({}, acc, {
      [name]: r
    });
  }, {});
  return res;
}

function parseArgv(argv) {
  const argvPath = (0, _path.resolve)(argv);

  try {
    const res = (0, _fs.lstatSync)(argvPath);

    if (res.isFile()) {
      const ts = new _TestSuite.default(argv, argvPath);
      return ts;
    } else if (res.isDirectory()) {
      const dir = buildDirectory(argv);
      const ts = new _TestSuite.default(argv, dir);
      return ts;
    }
  } catch (err) {
    // file or directory does not exist
    // eslint-disable-next-line
    console.error(err);
  }
}

const resolveTestSuites = (args, ignore) => {
  return args.slice(2) // ignore flags
  .filter(a => {
    return ignore.indexOf(a) < 0;
  }) // create test suites and remove paths that cannot be resolved
  .map(parseArgv).filter(testSuite => testSuite);
};

function watchFiles(files, callback) {
  files.forEach(file => {
    // console.log(`Watching ${file} for changes...`)
    (0, _fs.watchFile)(file, callback);
  });
}

function unwatchFiles(files) {
  files.forEach(file => {
    // console.log(`Unwatching ${file}`)
    (0, _fs.unwatchFile)(file);
  });
}
/**
 * Remove modules cached by require.
 */


function clearRequireCache() {
  Object.keys(require.cache).forEach(key => {
    delete require.cache[key];
  });
}

function requireTestSuite(ts) {
  return ts.require();
}

async function test(testSuites, watch, currentlyWatching = []) {
  clearRequireCache();
  testSuites.forEach(requireTestSuite);

  if (watch) {
    unwatchFiles(currentlyWatching);
    const newCurrentlyWatching = Object.keys(require.cache);
    watchFiles(newCurrentlyWatching, () => test(testSuites, watch, newCurrentlyWatching));
  }

  const stack = (0, _stream.createTestSuiteStackStream)();
  const rs = (0, _stream.createErrorTransformStream)();
  const ts = (0, _stream.createProgressTransformStream)();
  stack.pipe(ts).pipe(process.stdout);
  stack.pipe(rs);
  const catchment = new _catchment.default({
    rs
  });
  const count = {
    total: 0,
    error: 0
  };

  const notify = data => {
    if (typeof data != 'object') return;
    stack.write(data);

    if (data.type == 'test-end') {
      count.total++;

      if (data.error) {
        count.error++;
      }
    }
  };

  await (0, _lib.runInSequence)(testSuites, notify);
  stack.end();
  const errorsCatchment = await catchment.promise;
  process.stdout.write(_os.EOL);
  process.stdout.write(errorsCatchment);
  process.stdout.write(`🦅  Executed ${count.total} tests`);

  if (count.error) {
    process.stdout.write(`: ${count.error} error${count.error > 1 ? 's' : ''}`);
  }

  process.stdout.write(`.${_os.EOL}`);
  process.on('exit', () => process.exit(count.error));
}

const watch = process.argv.some(a => watchFlags.indexOf(a) != -1);
const babel = process.argv.some(a => babelFlags.indexOf(a) != -1);

if (babel) {
  try {
    require('@babel/register');
  } catch (err) {
    const p = (0, _path.resolve)(process.cwd(), 'node_modules/@babel/register');

    require(p);
  }
}

const testSuites = resolveTestSuites(process.argv, allFlags);

(async () => {
  try {
    await test(testSuites, watch);
  } catch ({
    message,
    stack
  }) {
    if (process.env.DEBUG) console.log(stack); // eslint-disable-line no-console

    console.error(message); // eslint-disable-line no-console

    process.exit(1);
  }
})();