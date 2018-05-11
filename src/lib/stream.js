import { Transform } from 'stream'
import { EOL } from 'os'
import { getPadding, indent, filterStack } from '.'

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
export function createTestSuiteStackStream() {
  const testSuiteStack = []
  const ts = new Transform({
    objectMode: true,
    transform({ type, name, ...props }, encoding, callback) {
      if (type === 'test-suite-start') {
        testSuiteStack.push(name)
      } else if (type === 'test-suite-end') {
        testSuiteStack.pop()
      }
      const stack = testSuiteStack.slice()
      ts.push({ type, name, stack, ...props })
      callback()
    },
  })
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
export function createProgressTransformStream() {
  const ts = new Transform({
    objectMode: true,
    transform({ type, name, stack, result }, encoding, callback) {
      if (type === 'test-suite-start') {
        this.push(indent(name, getPadding(stack.length)))
        this.push(EOL)
      } else if (type === 'test-end') {
        this.push(indent(result, getPadding(stack.length)))
        this.push(EOL)
      }
      callback()
    },
  })
  return ts
}

/**
 * Prints an error in red and error stack below it.
 * data[error]
 * data[error][stack]
 * data[stack]
 * data[name]
 */
export function createErrorTransformStream() {
  const ts = new Transform({
    objectMode: true,
    transform({ error, stack, name, test }, encoding, callback) {
      if (!error) {
        return callback()
      }
      this.push('\x1b[31m')
      this.push(stack.join(' > '))
      this.push(` > ${name}`)
      this.push('\x1b[0m')
      this.push(EOL)
      this.push(indent(filterStack(test), '  '))
      this.push(EOL)
      this.push(EOL)
      callback()
    },
  })
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
