function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('os'),
    EOL = _require.EOL;

var promto = require('promto');

var _require2 = require('./lib'),
    indent = _require2.indent,
    filterStack = _require2.filterStack,
    checkContext = _require2.checkContext,
    isFunction = _require2.isFunction;
/**
 * Create a new test object.
 * @param {string} name Name of a test
 * @param {function} fn Function as specified in specs
 * @param {Number} timeout Timeout in ms after which to throw timeout Error
 * @param {object|function} context Context object or function
 * @return {Test} A test object with initialised properties.
 */


var Test =
/*#__PURE__*/
function () {
  function Test(name, fn, timeout, context) {
    _classCallCheck(this, Test);

    this.timeout = timeout || 2000;
    this.name = name;
    this.fn = fn;
    this.started = null;
    this.finished = null;
    this.error = null;
    this.result = null;
    checkContext(context);

    if (context) {
      this._context = context;
    }
  }
  /**
   * Run the test.
   * @param {function} notify - notify function
   */


  _createClass(Test, [{
    key: "run",
    value: function run(notify) {
      return new Promise(function ($return, $error) {
        var res;

        if (typeof notify === 'function') {
          notify({
            type: 'test-start',
            name: this.name
          });
        }

        return Promise.resolve(runTest(this)).then(function ($await_7) {
          try {
            res = $await_7;

            if (typeof notify === 'function') {
              notify({
                test: this,
                type: 'test-end',
                name: this.name,
                result: this.dump(),
                error: this.error
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
      return dumpResult(this);
    }
  }, {
    key: "hasErrors",
    value: function hasErrors() {
      return this.error !== null;
    }
    /**
     * Return test's context (if context is a function, it will be overriden by the
     * end of the test run with evaluated context function).
     * @returns {object|function} context in current state
     */

  }, {
    key: "_evaluateContext",

    /**
     * Evaluate context function. The context function
     */
    value: function _evaluateContext() {
      return new Promise(function ($return, $error) {
        var context, ep, res, fn, c;
        context = this.context;

        if (Array.isArray(context)) {
          ep = context.map(function (c) {
            return new Promise(function ($return, $error) {
              var fn, d;
              fn = isFunction(c);
              if (!fn) return $return();
              d = {};
              return Promise.resolve(c.call(d)).then(function ($await_8) {
                try {
                  return $return(d);
                } catch ($boundEx) {
                  return $error($boundEx);
                }
              }.bind(this), $error);
            }.bind(this));
          });
          return Promise.resolve(Promise.all(ep)).then(function ($await_9) {
            try {
              res = $await_9;
              this._context = res;
              return $return();
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this), $error);
        }

        fn = isFunction(context);
        if (!fn) return $return();
        c = {};
        return Promise.resolve(context.call(c)).then(function ($await_10) {
          try {
            this._context = c;
            return $return();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this));
    }
  }, {
    key: "context",
    get: function get() {
      return this._context;
    }
  }]);

  return Test;
}();

var TICK = '\x1b[32m \u2713 \x1b[0m';
var CROSS = '\x1b[31m \u2717 \x1b[0m';

function dumpResult(test) {
  if (test.error === null) {
    return `${TICK} ${test.name}`;
  } else {
    return `${CROSS} ${test.name}` + EOL + indent(filterStack(test), ' | ');
  }
}
/**
 * Create a promise for a test function.
 * @param {function} fn function to execute
 * @param {object} ctx Contexts to pass as arguments in order
 * @return {Promise} A promise to execute function.
 */


function createTestPromise(fn, ctx) {
  return new Promise(function ($return, $error) {
    var _res, res;

    if (Array.isArray(ctx)) {
      return Promise.resolve(fn.apply(void 0, _toConsumableArray(ctx))).then(function ($await_11) {
        try {
          _res = $await_11;
          return $return(_res);
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }

    return Promise.resolve(fn(ctx)).then(function ($await_12) {
      try {
        res = $await_12;
        return $return(res);
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this), $error);
  }.bind(this));
}

function plainDestroyContext(_ref) {
  return new Promise(function ($return, $error) {
    var context, ep, allRes, res;
    context = _ref.context;

    if (Array.isArray(context)) {
      ep = context.map(function (c) {
        return new Promise(function ($return, $error) {
          var res;
          if (!isFunction(c._destroy)) return $return();
          return Promise.resolve(c._destroy()).then(function ($await_13) {
            try {
              res = $await_13;
              return $return(res);
            } catch ($boundEx) {
              return $error($boundEx);
            }
          }.bind(this), $error);
        }.bind(this));
      });
      return Promise.resolve(Promise.all(ep)).then(function ($await_14) {
        try {
          allRes = $await_14;
          return $return(allRes);
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }

    if (context && isFunction(context._destroy)) {
      return Promise.resolve(context._destroy()).then(function ($await_15) {
        try {
          res = $await_15;
          return $return(res);
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }

    function $If_6() {
      return $return();
    }

    return $return();
  }.bind(this));
}
/**
 * Asynchronously runs the test
 * @param {Test} test A test to run.
 * @return {Promise.<Test>} A promise resolved with the run test.
 */


function runTest(test) {
  return new Promise(function ($return, $error) {
    var evaluateContext, run, destroyContext;
    test.started = new Date();

    var $Try_1_Post = function () {
      try {
        var $Try_2_Post = function () {
          try {
            test.finished = new Date();
            return $return(test);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this);

        var $Try_2_Catch = function (err) {
          try {
            test.error = err;
            return $Try_2_Post();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this);

        try {
          destroyContext = plainDestroyContext(test);
          return Promise.resolve(promto(destroyContext, test.timeout, 'Destroy')).then(function ($await_16) {
            try {
              test.destroyResult = $await_16;
              return $Try_2_Post();
            } catch ($boundEx) {
              return $Try_2_Catch($boundEx);
            }
          }.bind(this), $Try_2_Catch);
        } catch (err) {
          $Try_2_Catch(err)
        }
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this);

    var $Try_1_Catch = function (err) {
      try {
        test.error = err;
        return $Try_1_Post();
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this);

    try {
      evaluateContext = test._evaluateContext();
      return Promise.resolve(promto(evaluateContext, test.timeout, 'Evaluate')).then(function ($await_17) {
        try {
          run = createTestPromise(test.fn, test.context);
          return Promise.resolve(promto(run, test.timeout, 'Test')).then(function ($await_18) {
            try {
              test.result = $await_18;
              return $Try_1_Post();
            } catch ($boundEx) {
              return $Try_1_Catch($boundEx);
            }
          }.bind(this), $Try_1_Catch);
        } catch ($boundEx) {
          return $Try_1_Catch($boundEx);
        }
      }.bind(this), $Try_1_Catch);
    } catch (err) {
      $Try_1_Catch(err)
    }
  }.bind(this));
}

module.exports = Test;