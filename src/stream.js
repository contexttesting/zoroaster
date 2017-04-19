const Transform = require('stream').Transform
const EOL = require('os').EOL
const lib = require('./lib')

/**
 * The whole file needs testing when you are especially (depressed)
 * excited.
 */

/**
 * Assigns test suite stack to each data object. Maintains a
 * test suite stack, and if a notification with type
 * 'test-suite-start' is coming, the name of the test suite
 * is pushed onto the stack. When 'test-suite-end' notification
 * comes, the top item is poped from the stack.
 * data[type]
 * data[name]
 * @returns {Transfrom} A transform stream maintaining a test suite
 * stack.
 * @todo: call back with an error if test-suite-end came with
 * a different test-suite than the one currently on top of the stack.
 * @todo: check for data to be an object to control this error
 */
function createTestSuiteStackStream() {
    const testSuiteStack = []
    const ts = new Transform({ objectMode: true })
    ts._transform = (data, encoding, callback) => {
        if (data.type === 'test-suite-start') {
            testSuiteStack.push(data.name)
        } else if (data.type === 'test-suite-end') {
            testSuiteStack.pop()
        }
        const stack = testSuiteStack.slice()
        ts.push(Object.assign(data, { stack }))
        callback()
    }
    return ts
}

/**
 * Prints test suites' name when they begin, and tests' names
 * when they finish. Each test must have a stack property
 * representing its error stack, therefore data must first
 * go through TestSuiteStack stream.
 * data[name]
 * data[type]
 * data[result]
 * data[stack]
 * @returns {Transform}
 */
function createProgressTransformStream() {
    const ts = new Transform({ objectMode: true })
    ts._transform = (data, encoding, callback) => {
        if (data.type === 'test-suite-start') {
            ts.push(lib.indent(data.name, lib.getPadding(data.stack.length)))
            ts.push(EOL)
        } else if (data.type === 'test-end') {
            const res = data.result
            ts.push(lib.indent(res, lib.getPadding(data.stack.length)))
            ts.push(EOL)
        }
        callback()
    }
    return ts
}

/**
 * Prints an error in red and error stack below it.
 * data[error]
 * data[error][stack]
 * data[stack]
 * data[name]
 */
function createErrorTransformStream() {
    const ts = new Transform({ objectMode: true })
    ts._transform = (data, encoding, callback) => {
        if (!data.error) {
            return callback()
        }
        ts.push('\x1b[31m')
        ts.push(data.stack.join(' > '))
        ts.push(` > ${data.name}`)
        ts.push('\x1b[0m')
        ts.push(EOL)
        ts.push(lib.indent(lib.filterStack(data.test), '  '))
        ts.push(EOL)
        ts.push(EOL)
        callback()
    }
    return ts
}

/* This needs to be a `drain`* */
// function createSuccessTransformStream() {
//     let successCount = 0
//     const ts = new Transform({ objectMode: true })
//     ts._transform = (data, encoding, callback) => {
//         successCount++
//         callback()
//     }
//     return ts
// }
/* * A drain is a structure that will collect and buffer from
 * a stream, and return (e.g., resolved promise) when stream
 * finished.
 */

module.exports = {
    createTestSuiteStackStream,
    createProgressTransformStream,
    createErrorTransformStream,
}
