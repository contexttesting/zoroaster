var cleanStack = require('clean-stack');

var _require = require('os'),
    EOL = _require.EOL;
/**
 * Run all tests in sequence, one by one.
 * @param {Test[]} tests An array with tests
 * @param {function} [notify] A notify function to be passed to run method
 */


function runInSequence(tests, notify) {
  return new Promise(function ($return, $error) {
    return Promise.resolve(tests.reduce(function (acc, t) {
      return new Promise(function ($return, $error) {
        return Promise.resolve(acc).then(function ($await_1) {
          try {
            return Promise.resolve(t.run(notify)).then(function ($await_2) {
              try {
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
    }, Promise.resolve())).then(function ($await_3) {
      try {
        return $return(tests);
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this), $error);
  }.bind(this));
}

function indent(str, padding) {
  return str.replace(/^(?!\s*$)/mg, padding);
}

function getPadding(level) {
  return Array.from({
    length: level * 2
  }).join(' ');
}

function checkContext(context) {
  var type = (typeof context).toLowerCase();

  if (type === 'function') {
    return; // functions are accepted from 0.4.1
  } else if (context !== undefined && type !== 'object') {
    throw new Error('Context must be an object.');
  } else if (context === null) {
    throw new Error('Context cannot be null.');
  }
}

function checkTestSuiteName(name) {
  if (typeof name !== 'string') {
    throw new Error('Test suite name must be given.');
  }
}
/**
 * Get clean stack for a test, without Node internals
 * @param {Test} test - test
 */


function filterStack(_ref) {
  var error = _ref.error,
      name = _ref.name;

  if (!error) {
    throw new Error('cannot filter stack when a test does not have an error');
  }

  var splitStack = error.stack.split('\n'); // break stack by \n and not EOL intentionally because Node uses \n
  // node 4 will print: at test_suite.test2
  // node 6 will print: at test2

  var regex = new RegExp(`at (.+\.)?${name}`);
  var resIndex = splitStack.findIndex(function (element) {
    return regex.test(element);
  }) + 1;
  var joinedStack = splitStack.slice(0, resIndex).join('\n');
  var stack = joinedStack ? joinedStack : cleanStack(error.stack); // use clean stack for async errors

  return stack.replace(/\n/g, EOL);
}

module.exports = {
  runInSequence,
  indent,
  getPadding,
  checkContext,
  checkTestSuiteName,
  filterStack
};