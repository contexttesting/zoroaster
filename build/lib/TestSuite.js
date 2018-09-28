const { EOL } = require('os');
const { isFunction, indent } = require('.');
let Test = require('./Test'); if (Test && Test.__esModule) Test = Test.default;

function hasParent({ parent }) {
  return parent instanceof TestSuite
}

/**
 * @param {string[]} names
 */
const hasFocused = names => names.some(n => n.startsWith('!'))

/**
 *
 * @param {(TestSuite|Test)[]} tests
 */
const getChildrenNames = (tests) => {
  return tests.reduce((acc, test) => {
    if (test instanceof TestSuite) {
      return [...acc, test.name, ...test.names]
    }
    return [...acc, test.name]
  }, [])
}

/**
 * A test suite is a collection of tests with any number of contexts.
 */
               class TestSuite {
  /**
   * @constructor
   * @param {string} name
   * @param {object} tests
   * @param {TestSuite} parent
   * @param {object|function} context
   * @param {number} timeout
   */
  constructor (name, tests, parent, context, timeout) {
    if (!name) throw new Error('Test suite name must be given.')

    this._name = name
    this._selfFocused = this.name.startsWith('!')
    this._parent = parent
    this._timeout = timeout || (hasParent(this) ? this.parent.timeout : undefined)

    if (!this._assignContext(context) && hasParent(this)) {
      this._context = parent.context
    }

    if (typeof tests != 'object') {
      throw new Error('You must provide tests in an object.')
    }
    this._assignTests(tests)
  }
  get path() {
    return this._path
  }
  get name() {
    return this._name
  }
  get parent() {
    return this._parent
  }
  get rawTests() {
    return this._rawTests
  }
  /**
   * @type {Test[]|TestSuite[]}
   */
  get tests() {
    return this._tests
  }
  get context() {
    return this._context
  }
  get timeout() {
    return this._timeout
  }

  _assignContext(context) {
    if (Array.isArray(context)) {
      this._context = context
      return true
    }
    const fn = isFunction(context)
    if (fn) {
      this._context = context
      return true
    }
    if ((typeof context).toLowerCase() == 'object') {
      const extendedContext = {
        ...(this._context || {}),
        ...context,
      } // this is for when test suites are extending object contexts
      this._context = Object.freeze(extendedContext)
      return true
    }
  }

  /**
   * Whether test suite has focused tests.
   */
  get hasFocused(){
    return this._hasFocused
  }

  _assignTests(tests) {
    if ('context' in tests) {
      this._assignContext(tests.context)
    }
    this._rawTests = tests
    this._tests = createTests(tests, this)

    this._names = getChildrenNames(this._tests)
    this._hasFocused = hasFocused(this._names)
  }

  /**
   * @returns {string[]} An array with all recursively gathered test and test suite names inside of the test suite.
   */
  get names() {
    return this._names
  }
  get isSelfFocused() {
    return this._selfFocused
  }

  /**
   * Run test suite.
   */
  async run(notify = () => {}, onlyFocused) {
    const { name } = this
    notify({ type:'test-suite-start', name })
    const res = await this.runInSequence(notify, onlyFocused)
    notify({ type:'test-suite-end', name })
    return res
  }
  dump() {
    const str = this.name + EOL + this.tests
      .map(test => test.dump())
      .join('\n')
    return this.parent ? indent(str, '    ') : str
  }
  hasErrors() {
    return this.tests
      .find(test =>
        test.hasErrors()
      )
  }

  /**
   * Run all tests in sequence, one by one.
   * @param {function} [notify] A notify function to be passed to run method.
   * @param {boolean} [onlyFocused = false] Run only focused tests.
   */
  async runInSequence(notify, onlyFocused) {
    await this.tests.reduce(async (acc, test) => {
      const accRes = await acc
      let res
      if (!onlyFocused) {
        res = await test.run(notify)
      } else if (test instanceof Test && test.isFocused) {
        res = await test.run(notify)
      // a test suite
      } else if (test.isSelfFocused) {
        res = await test.run(notify, test.hasFocused)
      } else if (test.hasFocused) {
        res = await test.run(notify, true)
      }
      return [...accRes, res]
    }, [])
  }
}

const sortTestSuites = ({ name: a }, { name: b }) => {
  if (a == 'default') return -1
  if (b == 'default') return 1
  return 0
}

/**
 * Sort tests and test suites so that tests run before
 * test suites. We delibarately don't use V8's unstable
 * Array.sort().
 * @param {Array} tests - test cases and test suites to sort
 * @returns {Array} Sorted array with tests before test suites.
 */
function sort(tests) {
  const testSuites = []
  const testCases = []
  tests.forEach((test) => {
    if (test instanceof Test) {
      testCases.push(test)
    } else {
      testSuites.push(test)
    }
  })
  const sts = testSuites.sort(sortTestSuites)
  return [...testCases, ...sts]
}

function filterContextKey(key) {
  return key != 'context'
}

/**
 * Map object with test names as keys and test functions as values
 * to an array of tests.
 * @param {object} object - a raw tests map as found in test files
 * @param {TestSuite} parent - parent test suite
 * @return {Array<Test>} An array with tests.
 */
function createTests(object, parent) {
  const tests = Object.keys(object)
    .filter(filterContextKey)
    .map((key) => {
      const v = object[key]
      if (v instanceof TestSuite) return v
      switch (typeof v) {
      case 'function': {
        const test = new Test(key, v, parent.timeout, parent.context)
        return test
      }
      case 'object': {
        const ts = new TestSuite(key, v, parent)
        return ts
      }
      }
    })
    .filter(t => t)
  return sort(tests)
}

module.exports = TestSuite