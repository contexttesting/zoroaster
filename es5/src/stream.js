function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

var Transform = require('stream').Transform;

var EOL = require('os').EOL;

var _require = require('./lib'),
    getPadding = _require.getPadding,
    indent = _require.indent,
    filterStack = _require.filterStack;
/**
 * The whole file needs testing when you are especially (depressed)
 * excited.
 */

/**
 * Assigns test suite stack to each data object. Maintains a
 * test suite stack, and if a notification with type
 * 'test-suite-start' is coming, the name of the test suite
 * is pushed onto the stack. When 'test-suite-end' notification
 * comes, the top item is poped from the stack.
 * data[type]
 * data[name]
 * @returns {Transfrom} A transform stream maintaining a test suite
 * stack.
 * @todo: call back with an error if test-suite-end came with
 * a different test-suite than the one currently on top of the stack.
 * @todo: check for data to be an object to control this error
 */


function createTestSuiteStackStream() {
  var testSuiteStack = [];
  var ts = new Transform({
    objectMode: true,

    transform(_ref, encoding, callback) {
      var type = _ref.type,
          name = _ref.name,
          props = _objectWithoutProperties(_ref, ["type", "name"]);

      if (type === 'test-suite-start') {
        testSuiteStack.push(name);
      } else if (type === 'test-suite-end') {
        testSuiteStack.pop();
      }

      var stack = testSuiteStack.slice();
      ts.push(_extends({
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
  var ts = new Transform({
    objectMode: true,

    transform(_ref2, encoding, callback) {
      var type = _ref2.type,
          name = _ref2.name,
          stack = _ref2.stack,
          result = _ref2.result;

      if (type === 'test-suite-start') {
        this.push(indent(name, getPadding(stack.length)));
        this.push(EOL);
      } else if (type === 'test-end') {
        this.push(indent(result, getPadding(stack.length)));
        this.push(EOL);
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
  var ts = new Transform({
    objectMode: true,

    transform(_ref3, encoding, callback) {
      var error = _ref3.error,
          stack = _ref3.stack,
          name = _ref3.name,
          test = _ref3.test;

      if (!error) {
        return callback();
      }

      this.push('\x1b[31m');
      this.push(stack.join(' > '));
      this.push(` > ${name}`);
      this.push('\x1b[0m');
      this.push(EOL);
      this.push(indent(filterStack(test), '  '));
      this.push(EOL);
      this.push(EOL);
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


module.exports = {
  createTestSuiteStackStream,
  createProgressTransformStream,
  createErrorTransformStream
};