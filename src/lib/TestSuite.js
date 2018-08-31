import { EOL } from 'os'
import { isFunction, checkTestSuiteName, runInSequence, indent } from '.'
import Test from './Test'

const TIMEOUT = parseInt(process.env.ZOROASTER_TIMEOUT, 10) || 2000

function hasParent({ parent }) {
  return parent instanceof TestSuite
}

/**
 * A test suite is a collection of tests with any number of contexts.
 */
export default class TestSuite {
  constructor (name, testsOrPath, parent, context, timeout) {
    checkTestSuiteName(name)

    this._name = name
    this._parent = parent
    this._timeout = timeout || (hasParent(this) ? this.parent.timeout : undefined)

    if (!this._assignContext(context) && hasParent(this)) {
      this._context = parent.context
    }

    if (typeof testsOrPath == 'string') {
      this._path = testsOrPath
    } else if (typeof testsOrPath == 'object') {
      this._assignTests(testsOrPath)
    } else {
      throw new Error('You must provide either a path to a module, or tests in an object.')
    }
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

  _assignTests(tests) {
    if ('context' in tests) {
      this._assignContext(tests.context)
    }
    this._rawTests = tests
    this._tests = createTests(tests, this)
  }

  /**
   * Recursively require files for a test suite.
   * @todo require for a single test
   */
  require() {
    if (this._path) {
      const tests = requireModule(this._path)
      this._assignTests(tests)
    }
    this.tests.forEach((test) => {
      if (test instanceof TestSuite) {
        test.require()
      }
    })
  }

  /**
   * @returns {string[]} An array with recursively gathered test names, including the name of this test suite.
   */
  get names() {
    return this.tests.reduce((acc, test) => {
      if (test instanceof TestSuite) {
        return [...acc, ...test.names]
      }
      return [...acc, test.name]
    }, [this.name])
  }

  /**
   * Run test suite.
   */
  async run(notify = () => {}) {
    notify({
      type:'test-suite-start',
      name: this.name,
    })
    const res = await runInSequence(this.tests, notify)
    notify({ type:'test-suite-end', name: this.name })
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
  const tests = Object
    .keys(object)
    .filter(filterContextKey)
    .map((key) => {
      const v = object[key]
      switch (typeof v) {
      case 'function': {
        const test = new Test(key, v, parent.timeout || TIMEOUT, parent.context)
        return test
      }
      case 'object': {
        const ts = new TestSuite(key, v, parent)
        return ts
      }
      case 'string': {
        const ts = new TestSuite(key, v, parent)
        return ts
      }
      }
    })
    .filter(t => t)
  return sort(tests)
}

function requireModule(modulePath) {
  return require(modulePath)
}