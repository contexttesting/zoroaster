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

module.exports = {
    runInSequence,
    indent,
    getPadding,
    checkContext,
    checkTestSuiteName,
}
