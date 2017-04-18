const cleanStack = require('clean-stack')

const EOL = require('os').EOL

/**
 * Run all tests in sequence, one by one.
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
    if (context !== undefined && (typeof context).toLowerCase() !== 'object') {
        throw new Error('Context must be an object.')
    }
    if (context === null) {
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

module.exports = {
    runInSequence,
    indent,
    getPadding,
    checkContext,
    checkTestSuiteName,
    filterStack,
}
