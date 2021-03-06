import { EOL } from 'os'
import { isFunction, indent } from './'
import Test from './Test'

/**
 * @param {!TestSuite} ts
 */
function hasParent({ parent }) {
  return parent instanceof TestSuite
}

/**
 * @param {!Array<string>} names
 */
const hasFocused = names => names.some(n => {
  return n.startsWith('!') || n.startsWith('$')
})

/**
 * Returns the full array of names within a test suite.
 * @param {!Array<!(TestSuite|Test)>} tests
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
 * @implements {_contextTesting.TestSuite}
 */
export default class TestSuite {
  /**
   * @param {string} name
   * @param {!Object} tests
   * @param {TestSuite} [parent] The parent test suite, or null.
   * @param {*} [context]
   * @param {number} [timeout]
   */
  constructor (name, tests, parent, context, timeout) {
    if (!name) throw new Error('Test suite name must be given.')

    this._name = name
    this._parent = parent
    this._timeout = timeout || (hasParent(this) ? this.parent.timeout : undefined)

    this._persistentContext = undefined
    this._context = undefined

    if (!this._assignContext(context) && hasParent(this)) {
      this._context = parent.context
    }

    if (typeof tests != 'object')
      throw new Error('You must provide tests in an object.')

    this._hasFocused = false
    /** @type {Array<!(TestSuite|Test)>} */
    this._tests = []
    /** @type {!Array<string>} */
    this._names = []
    this._rawTests = {}

    this._assignTests(tests)
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
   * @type {Array<!(Test|TestSuite)>}
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
  _assignPersistentContext(context) {
    if (Array.isArray(context)) {
      this._persistentContext = context
      return true
    }
    const fn = isFunction(context)
    if (fn) {
      this._persistentContext = context
      return true
    }
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

  /** */
  _assignTests(t) {
    const { 'context': context, 'persistentContext': persistentContext, ...tests } = t
    if (context !== undefined) {
      this._assignContext(context)
    }
    if (persistentContext !== undefined) {
      this._assignPersistentContext(persistentContext)
    }
    this._rawTests = tests
    this._tests = createTests(tests, this)

    this._names = getChildrenNames(this._tests)
    this._hasFocused = hasFocused(this._names)
  }

  /**
   * @returns {!Array<string>} An array with all recursively gathered test and test suite names inside of the test suite.
   */
  get names() {
    return this._names
  }
  get isFocused() {
    return this.name.startsWith('!') || this.name.startsWith('$')
  }

  // /**
  //  * Run without notifying of itself.
  //  * @param {!Function} [notify] A notify function to be passed to run method.
  //  * @param {boolean} [onlyFocused = false] Run only focused tests.
  //  */
  // async run(notify = () => {}, onlyFocused) {
  //   // This should be deprecated, tests and test suites are run with `lib/run-test.js`.
  //   console.log(c('Deprecated method TestSuite.run', 'red'))
  //   let pc
  //   if (this._persistentContext) {
  //     pc = await evaluatePersistentContext(this._persistentContext)
  //     bindContexts(this.tests, [pc])
  //   }
  //   const res = await runTestSuiteAndNotify(notify, [], '', [], {
  //     name: this.name,
  //     tests: this.tests,
  //   }, onlyFocused)
  //   if (pc) {
  //     await destroyPersistentContext(pc)
  //   }
  //   return res
  // }
  dump() {
    const str = this.name + EOL + this.tests
      .map(test => test.dump())
      .join('\n')
    return this.parent ? indent(str, '    ') : str
  }
  /**
   * The persistent context.
   */
  get persistentContext() {
    return this._persistentContext
  }
}

const sortTestSuites = ({ name: a }, { name: b }) => {
  if (a == 'default') return -1
  if (b == 'default') return 1
  return 0
}

/**
 * Sort tests and test suites so that tests run before test suites. Deliberately don't use V8's unstable Array.sort().
 * @param {!Array<!Test|!TestSuite>} tests - test cases and test suites to sort
 * @returns {!Array<!Test|!TestSuite>} Sorted array with tests before test suites.
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

/**
 * Map object with test names as keys and test functions as values
 * to an array of tests.
 * @param {!Object} object - a raw tests map as found in test files
 * @param {TestSuite} parent - parent test suite
 * @return {!Array<!(Test|TestSuite)>} An array with tests and test suites.
 */
function createTests(object, parent) {
  const tests = Object.keys(object)
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