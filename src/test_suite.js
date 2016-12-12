'use strict'

const lib = require('./lib')
const Test = require('./test')
const EOL = require('os').EOL

const timeout = parseInt(process.env.ZOROASTER_TIMEOUT, 10) || 2000

class TestSuite {
    constructor (name, testsOrPath, parent) {
        if (typeof name !== 'string') {
            throw new Error('Test suite name must be given.')
        }
        this._name = name
        this._parent = parent

        if (typeof testsOrPath === 'string') {
            this._path = testsOrPath
        } else if (typeof testsOrPath === 'object') {
            this._rawTests = testsOrPath
            this._tests = createTests(this.rawTests, this)
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

    // todo: require for test
    require() {
        if (this._path) {
            this._rawTests = requireModule(this._path)
            this._tests = createTests(this.rawTests, this)
        }
        this.tests.forEach((test) => {
            if (test instanceof TestSuite) {
                test.require()
            }
        })
    }
    run() {
        return lib.runInSequence(this.tests)
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
 * test suites.
 */
function sortTests(a, b) {
    if (a instanceof Test && b instanceof TestSuite) {
        return -1
    } else if (a instanceof TestSuite && b instanceof Test) {
        return 1
    }
    return 0
}

/**
 * Map object with test names as keys and test functions as values
 * to an array of tests.
 * @param {object} object
 * @return {array<Test>} An array with tests.
 */
function createTests(object, parent) {
    return Object
        .keys(object)
        .map((key) => {
            switch (typeof object[key]) {
            case 'function':
                return new Test(key, object[key], timeout)
            case 'object':
                return new TestSuite(key, object[key], parent)
            case 'string':
                return new TestSuite(key, object[key], parent)
            }
        })
        .filter(test => test !== undefined)
        .sort(sortTests)
}

function requireModule(modulePath) {
    return require(modulePath)
}

module.exports = TestSuite
