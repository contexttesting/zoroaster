"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTestSuiteStackStream = createTestSuiteStackStream;
exports.createProgressTransformStream = createProgressTransformStream;
exports.createErrorTransformStream = createErrorTransformStream;

var _stream = require("stream");

var _os = require("os");

var _ = require(".");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

/**
 * The whole file needs testing when you are especially (depressed)
 * excited.
 */

/**
 * Assigns test suite stack to each data object. Maintains a
 * test suite stack, and if a notification with type
 * 'test-suite-start' is coming, the name of the test suite
 * is pushed onto the stack. When 'test-suite-end' notification
 * comes, the top item is popped from the stack.
 * data[type]
 * data[name]
 * @returns {Transfrom} A transform stream maintaining a test suite
 * stack.
 * @todo: call back with an error if test-suite-end came with
 * a different test-suite than the one currently on top of the stack.
 * @todo: check for data to be an object to control this error
 */
function createTestSuiteStackStream() {
  const testSuiteStack = [];
  const ts = new _stream.Transform({
    objectMode: true,

    transform(_ref, encoding, callback) {
      let {
        type,
        name
      } = _ref,
          props = _objectWithoutProperties(_ref, ["type", "name"]);

      if (type == 'test-suite-start' && name != 'default') {
        testSuiteStack.push(name);
      } else if (type == 'test-suite-end' && name != 'default') {
        testSuiteStack.pop();
      }

      const stack = testSuiteStack.slice();
      ts.push(_objectSpread({
        type,
        name,
        stack
      }, props));
      callback();
    }

  });
  return ts;
}
/**
 * Prints test suites' name when they begin, and tests' names
 * when they finish. Each test must have a stack property
 * representing its error stack, therefore data must first
 * go through TestSuiteStack stream.
 * data[name]
 * data[type]
 * data[result]
 * data[stack]
 * @returns {Transform}
 */


function createProgressTransformStream() {
  const ts = new _stream.Transform({
    objectMode: true,

    transform({
      type,
      name,
      stack,
      result
    }, encoding, callback) {
      if (type == 'test-suite-start' && name != 'default') {
        this.push((0, _.indent)(name, (0, _.getPadding)(stack.length)));
        this.push(_os.EOL);
      } else if (type == 'test-end') {
        this.push((0, _.indent)(result, (0, _.getPadding)(stack.length)));
        this.push(_os.EOL);
      }

      callback();
    }

  });
  return ts;
}
/**
 * Prints an error in red and error stack below it.
 * data[error]
 * data[error][stack]
 * data[stack]
 * data[name]
 */


function createErrorTransformStream() {
  const ts = new _stream.Transform({
    objectMode: true,

    transform({
      error,
      stack,
      name,
      test
    }, encoding, callback) {
      if (!error) {
        return callback();
      }

      this.push('\x1b[31m');
      this.push(stack.join(' > '));
      this.push(` > ${name}`);
      this.push('\x1b[0m');
      this.push(_os.EOL);
      this.push((0, _.indent)((0, _.filterStack)(test), '  '));
      this.push(_os.EOL);
      this.push(_os.EOL);
      callback();
    }

  });
  return ts;
}
/* This needs to be a `drain`* */
// function createSuccessTransformStream() {
//     let successCount = 0
//     const ts = new Transform({ objectMode: true })
//     ts._transform = (data, encoding, callback) => {
//         successCount++
//         callback()
//     }
//     return ts
// }

/* * A drain is a structure that will collect and buffer from
 * a stream, and return (e.g., resolved promise) when stream
 * finished.
 */