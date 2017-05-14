const cleanStack = require('clean-stack')

const EOL = require('os').EOL

/**
 * Run all tests in sequence, one by one.
 * @param {Array<Test>} tests An array with tests
 * @param {function} [notify] A notify function to be passed to run method
 */
function runInSequence(tests, notify) {
    return tests
        .reduce((acc, t) =>
            acc.then(() => t.run(notify))
        , Promise.resolve())
        .then(() => tests)
}

function indent(str, padding) {
    return str.replace(/^(?!\s*$)/mg, padding)
}

function getPadding(level) {
    return Array
        .from({ length: level * 2 })
        .join(' ')
}

function checkContext(context) {
    const type = (typeof context).toLowerCase()
    if (type === 'function') {
        return // functions are accepted from 0.4.1
    } else if (context !== undefined &&  type !== 'object') {
        throw new Error('Context must be an object.')
    } else if (context === null) {
        throw new Error('Context cannot be null.')
    }
}

function checkTestSuiteName(name) {
    if (typeof name !== 'string') {
        throw new Error('Test suite name must be given.')
    }
}

/**
 * Get clean stack for a test, without Node internals
 * @param {Test} test - test
 */
function filterStack(test) {
    if (!test.error) {
        throw new Error('cannot filter stack when a test does not have an error')
    }
    const splitStack = test.error.stack.split('\n') // break stack by \n and not EOL intentionally because Node uses \n
    // node 4 will print: at test_suite.test2
    // node 6 will print: at test2
    const regex = new RegExp(`at (.+\.)?${test.name}`)
    const resIndex = splitStack.findIndex(element => regex.test(element)) + 1
    const joinedStack = splitStack.slice(0, resIndex).join('\n')
    const stack = joinedStack ? joinedStack : cleanStack(test.error.stack) // use clean stack for async errors
    return stack.replace(/\n/g, EOL)
}

function isString(s) {
    return typeof(s).toLowerCase() === 'string'
}

module.exports = {
    runInSequence,
    indent,
    getPadding,
    checkContext,
    checkTestSuiteName,
    filterStack,
    isString,
}
