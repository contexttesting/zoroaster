function runInSequence(tests) {
    return tests.reduce((acc, t) =>
        acc.then(() => t.run())
    , Promise.resolve())
        .then(() => tests);
}

function indent(str, padding) {
    return str.replace(/^(?!\s*$)/mg, padding);
}

module.exports = {
    runInSequence,
    indent,
};
