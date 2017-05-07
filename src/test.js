'use strict'

const EOL = require('os').EOL
const lib = require('./lib')

/**
 * Create a new test object.
 * @param {string} name Name of a test
 * @param {function} fn Function as specified in specs
 * @param {Number} timeout Timeout in ms after which to throw timeout Error
 * @param {object|function} context Context object or function
 * @return {Test} A test object with inialised properties.
 */
class Test {
    constructor (name, fn, timeout, context) {
        this.timeout = timeout || 2000
        this.name = name
        this.fn = fn
        this.started = null
        this.finished = null
        this.error = null
        this.result = null

        lib.checkContext(context)
        if (context) {
            this._context = context
        }
    }

    /**
     * Run the test.
     * @param {function} notify - notify function
     */
    run(notify) {
        if (typeof notify === 'function') {
            notify({
                type:'test-start',
                name: this.name
            })
        }
        return runTest(this)
            .then((res) => {
                if (typeof notify === 'function') {
                    notify({
                        test: this,
                        type:'test-end',
                        name: this.name,
                        result: this.dump(),
                        error: this.error,
                    })
                }
                return res
            })
    }
    dump() {
        return dumpResult(this)
    }
    hasErrors() {
        return this.error !== null
    }
    /**
     * Return test's context (if context is a function, it will be overriden by the
     * end of the test run with evaluated context function).
     * @returns {object|function} context in current state
     */
    get context() {
        return this._context
    }

    /**
     * If context is a function, it will be replaced by the result of evaluating this function
     * @returns {Promise} A promise which will be resolved when context could be retrieved (because
     * context passed as a function can return a promise, to allow async evaluation of context).
     */
    _evaluateContext() {
        const context = this.context
        const type = (typeof context).toLowerCase()

        if (type !== 'function') {
            return Promise.resolve(context)
        }
        const cntxt = {}
        const res = context.call(cntxt)

        if (res instanceof Promise) {
            return res
                .then(() => {
                    this._context = cntxt
                    return cntxt
                })
        }
        this._context = cntxt
        return Promise.resolve(cntxt)
    }
}

function dumpResult(test) {
    if (test.error === null) {
        return '\x1b[32m \u2713 \x1b[0m ' + test.name
    } else {
        return '\x1b[31m \u2717 \x1b[0m ' + test.name + EOL
            + lib.indent(lib.filterStack(test), ' | ')
    }
}

/**
 * Create a promise for a test function.
 * @param {function} fn - function to execute
 * @param {object} ctx - first argument to pass to the function
 * @return {Promise} A promise to execute function.
 */
function createTestPromise(fn, ctx) {
    return Promise
        .resolve()
        .then(() => fn(ctx))
}

function createTimeoutPromise(test) {
    const delay = test.timeout
    let timeout
    const promise = new Promise((_, reject) => {
        timeout = setTimeout(() => {
            const message = `Test has timed out after ${delay}ms`
            const err = new Error(message)
            err.stack = `Error: ${message}` // don't expose internals
            reject(err)
        }, delay)
    })
    return { promise, timeout }
}

/**
 * Returns a promise to run a test.
 * @param {Test} test - a test to run
 * @return {Promise} A promise resolved with the run test.
 */
function runTest(test) {
    test.started = new Date()

    const testPromise =
        test._evaluateContext()
            .then(context => createTestPromise(test.fn, context))
    const timeoutPromise = createTimeoutPromise(test)

    const runPromise = Promise.race([
        testPromise,
        timeoutPromise.promise,
    ])
        // ensure clear timeout is called
        .catch((err) => {
            clearTimeout(timeoutPromise.timeout)
            throw err
        })
        .then((res) => {
            // console.log('timeout clear for', test.name, timeoutPromise.timeout)
            // console.log('promise resolved, clear timeout', test.name)
            // if promise has been resolved without timing out, clear created timeout
            clearTimeout(timeoutPromise.timeout)
            return res
        })

    return runPromise
        .then(
            (res) => { test.result = res },
            (err) => { test.error = err }
        )
        .then(() => { test.finished = new Date() })
        .then(() => test)
}

module.exports = Test
