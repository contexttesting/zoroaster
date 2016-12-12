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

module.exports = {
    runInSequence,
    indent,
    getPadding,
}
