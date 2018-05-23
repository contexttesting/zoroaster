"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runInSequence = runInSequence;
exports.indent = indent;
exports.getPadding = getPadding;
exports.checkTestSuiteName = checkTestSuiteName;
exports.filterStack = filterStack;
exports.isFunction = isFunction;
exports.destroyContexts = exports.evaluateContext = exports.bindMethods = void 0;

var _cleanStack = _interopRequireDefault(require("clean-stack"));

var _os = require("os");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Run all tests in sequence, one by one.
 * @param {Test[]} tests An array with tests
 * @param {function} [notify] A notify function to be passed to run method
 */
async function runInSequence(tests, notify) {
  await tests.reduce(async (acc, t) => {
    await acc;
    await t.run(notify);
  }, Promise.resolve());
  return tests;
}

function indent(str, padding) {
  return str.replace(/^(?!\s*$)/mg, padding);
}

function getPadding(level) {
  return Array.from({
    length: level * 2
  }).join(' ');
}

function checkTestSuiteName(name) {
  if (typeof name != 'string') {
    throw new Error('Test suite name must be given.');
  }
}
/**
 * Get clean stack for a test, without Node internals
 * @param {Test} test - test
 */


function filterStack({
  error,
  name
}) {
  if (!error) {
    throw new Error('cannot filter stack when a test does not have an error');
  }

  const splitStack = error.stack.split('\n'); // break stack by \n and not EOL intentionally because Node uses \n
  // node 4 will print: at test_suite.test2
  // node 6 will print: at test2

  const regex = new RegExp(`at (.+\.)?${name}`);
  const resIndex = splitStack.findIndex(element => regex.test(element)) + 1;
  const joinedStack = splitStack.slice(0, resIndex).join('\n');
  const stack = joinedStack ? joinedStack : (0, _cleanStack.default)(error.stack); // use clean stack for async errors

  return stack.replace(/\n/g, _os.EOL);
}

function isFunction(fn) {
  return (typeof fn).toLowerCase() == 'function';
}

const bindMethods = (instance, ignore = []) => {
  const methods = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(instance));
  const boundMethods = Object.keys(methods).filter(k => {
    return ignore.indexOf(k) < 0;
  }).reduce((acc, k) => {
    const method = methods[k];
    const isFn = isFunction(method.value);
    if (!isFn) return acc;
    method.value = method.value.bind(instance);
    return _objectSpread({}, acc, {
      [k]: method
    });
  }, {});
  Object.defineProperties(instance, boundMethods);
};

exports.bindMethods = bindMethods;

const evaluateContext = async context => {
  const fn = isFunction(context);
  if (!fn) return context;

  try {
    const c = {};
    await context.call(c);
    return c;
  } catch (err) {
    if (!/^Class constructor/.test(err.message)) {
      throw err;
    } // constructor context


    const c = new context();

    if (c._init) {
      await c._init();
    }

    bindMethods(c, ['constructor', '_init', '_destroy']);
    return c;
  }
};

exports.evaluateContext = evaluateContext;

const destroyContexts = async contexts => {
  const dc = contexts.map(async c => {
    if (isFunction(c._destroy)) {
      const res = await c._destroy();
      return res;
    }
  });
  const res = await Promise.all(dc);
  return res;
};

exports.destroyContexts = destroyContexts;