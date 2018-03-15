function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('os'),
    EOL = _require.EOL;

var lib = require('./lib');

var Test = require('./test');

var TIMEOUT = parseInt(process.env.ZOROASTER_TIMEOUT, 10) || 2000;

function hasParent(testSuite) {
  return testSuite.parent instanceof TestSuite;
}

var TestSuite =
/*#__PURE__*/
function () {
  function TestSuite(name, testsOrPath, parent, context, timeout) {
    _classCallCheck(this, TestSuite);

    lib.checkTestSuiteName(name);
    lib.checkContext(context);
    this._name = name;
    this._parent = parent;
    this._timeout = timeout || (hasParent(this) ? this.parent.timeout : undefined);

    if (!this._assignContext(context) && hasParent(this)) {
      this._context = parent.context;
    }

    if (typeof testsOrPath === 'string') {
      this._path = testsOrPath;
    } else if (typeof testsOrPath === 'object') {
      this._assignTests(testsOrPath);
    } else {
      throw new Error('You must provide either a path to a module, or tests in an object.');
    }
  }

  _createClass(TestSuite, [{
    key: "_assignContext",
    value: function _assignContext(context) {
      if ((typeof context).toLowerCase() === 'function') {
        this._context = context;
        return true;
      } else if ((typeof context).toLowerCase() === 'object') {
        var extenedContext = Object.assign({}, this._context || {}, context); // + deep assign

        this._context = Object.freeze(extenedContext);
        return true;
      }
    }
  }, {
    key: "_assignTests",
    value: function _assignTests(tests) {
      if ('context' in tests) {
        lib.checkContext(tests.context);

        this._assignContext(tests.context);
      }

      this._rawTests = tests;
      this._tests = createTests(tests, this);
    }
    /**
     * Recursively require files for a test suite.
     * @todo require for a single test
     */

  }, {
    key: "require",
    value: function require() {
      if (this._path) {
        var tests = requireModule(this._path);

        this._assignTests(tests);
      }

      this.tests.forEach(function (test) {
        if (test instanceof TestSuite) {
          test.require();
        }
      });
    }
    /**
     * Run test suite.
     */

  }, {
    key: "run",
    value: function run(notify) {
      return new Promise(function ($return, $error) {
        var res;

        if (typeof notify === 'function') {
          notify({
            type: 'test-suite-start',
            name: this.name
          });
        }

        return Promise.resolve(lib.runInSequence(this.tests, notify)).then(function ($await_1) {
          try {
            res = $await_1;

            if (typeof notify === 'function') {
              notify({
                type: 'test-suite-end',
                name: this.name
              });
            }

            return $return(res);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this));
    }
  }, {
    key: "dump",
    value: function dump() {
      var str = this.name + EOL + this.tests.map(function (test) {
        return test.dump();
      }).join('\n');
      return this.parent ? lib.indent(str, '    ') : str;
    }
  }, {
    key: "hasErrors",
    value: function hasErrors() {
      return this.tests.find(function (test) {
        return test.hasErrors();
      });
    }
  }, {
    key: "path",
    get: function get() {
      return this._path;
    }
  }, {
    key: "name",
    get: function get() {
      return this._name;
    }
  }, {
    key: "parent",
    get: function get() {
      return this._parent;
    }
  }, {
    key: "rawTests",
    get: function get() {
      return this._rawTests;
    }
  }, {
    key: "tests",
    get: function get() {
      return this._tests;
    }
  }, {
    key: "context",
    get: function get() {
      return this._context;
    }
  }, {
    key: "timeout",
    get: function get() {
      return this._timeout;
    }
  }]);

  return TestSuite;
}();
/**
 * Sort tests and test suites so that tests run before
 * test suites. We delibarately don't use V8's unstable
 * Array.sort().
 * @param {Array} tests - test cases and test suites to sort
 * @returns {Array} Sorted array with tests before test suites.
 */


function sort(tests) {
  var testSuites = [];
  var testCases = [];
  tests.forEach(function (test) {
    if (test instanceof Test) {
      testCases.push(test);
    } else {
      testSuites.push(test);
    }
  });
  return Array.prototype.concat([], testCases, testSuites);
}

function filterContextKey(key) {
  return key !== 'context';
}
/**
 * Map object with test names as keys and test functions as values
 * to an array of tests.
 * @param {object} object - a raw tests map as found in test files
 * @param {TestSuite} parent - parent test suite
 * @return {Array<Test>} An array with tests.
 */


function createTests(object, parent) {
  var tests = Object.keys(object).filter(filterContextKey).map(function (key) {
    switch (typeof object[key]) {
      case 'function':
        return new Test(key, object[key], parent.timeout || TIMEOUT, parent.context);

      case 'object':
        return new TestSuite(key, object[key], parent);

      case 'string':
        return new TestSuite(key, object[key], parent);
    }
  }).filter(function (test) {
    return test !== undefined;
  });
  return sort(tests);
}

function requireModule(modulePath) {
  return require(modulePath);
}

module.exports = TestSuite;