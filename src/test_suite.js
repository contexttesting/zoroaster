'use strict'

const lib = require('./lib')
const Test = require('./test')
const EOL = require('os').EOL

const TIMEOUT = parseInt(process.env.ZOROASTER_TIMEOUT, 10) || 2000

function hasParent(testSuite) {
    return testSuite.parent instanceof TestSuite
}

class TestSuite {
    constructor (name, testsOrPath, parent, context, timeout) {
        lib.checkTestSuiteName(name)
        lib.checkContext(context)

        this._name = name
        this._parent = parent
        this._timeout = timeout || (hasParent(this) ? this.parent.timeout : undefined)

        if (!this._assignContext(context) && hasParent(this)) {
            this._context = parent.context
        }

        if (typeof testsOrPath === 'string') {
            this._path = testsOrPath
        } else if (typeof testsOrPath === 'object') {
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
        if ((typeof context).toLowerCase() === 'function') {
            this._context = context
            return true
        } else if ((typeof context).toLowerCase() === 'object') {
            const extenedContext = Object.assign({}, this._context || {}, context)  // + deep assign
            this._context = Object.freeze(extenedContext)
            return true
        }
    }

    _assignTests(tests) {
        if ('context' in tests) {
            lib.checkContext(tests.context)
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
     * Run test suite.
     */
    run(notify) {
        if (typeof notify === 'function') {
            notify({
                type:'test-suite-start',
                name: this.name,
            })
        }
        return lib
            .runInSequence(this.tests, notify)
            .then((res) => {
                if (typeof notify === 'function') {
                    notify({ type:'test-suite-end', name: this.name })
                }
                return res
            })
    }
    dump() {
        const str = this.name + EOL + this.tests
            .map(test => test.dump())
            .join('\n')
        return this.parent ? lib.indent(str, '    ') : str
    }
    hasErrors() {
        return this.tests
            .find(test =>
                test.hasErrors()
            )
    }
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
    return Array.prototype.concat([], testCases, testSuites)
}

function filterContextKey(key) {
    return key !== 'context'
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
            switch (typeof object[key]) {
            case 'function':
                return new Test(key, object[key], parent.timeout || TIMEOUT, parent.context)
            case 'object':
                return new TestSuite(key, object[key], parent)
            case 'string':
                return new TestSuite(key, object[key], parent)
            }
        })
        .filter(test => test !== undefined)
    return sort(tests)
}

function requireModule(modulePath) {
    return require(modulePath)
}

module.exports = TestSuite
