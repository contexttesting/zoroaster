const { EOL } = require('os')
const promto = require('promto')
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
  constructor(name, fn, timeout, context) {
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
  async run(notify) {
    if (typeof notify === 'function') {
      notify({
        type: 'test-start',
        name: this.name,
      })
    }
    const res = await runTest(this)
    if (typeof notify === 'function') {
      notify({
        test: this,
        type: 'test-end',
        name: this.name,
        result: this.dump(),
        error: this.error,
      })
    }
    return res
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
   * Evaluate context function. The context function
   */
  async _evaluateContext() {
    const { context } = this
    if ((typeof context).toLowerCase() !== 'function') {
      return
    }

    const c = {}
    await context.call(c)
    this._context = c
  }
}

const TICK = '\x1b[32m \u2713 \x1b[0m'
const CROSS = '\x1b[31m \u2717 \x1b[0m'

function dumpResult(test) {
  if (test.error === null) {
    return `${TICK} ${test.name}`
  } else {
    return `${CROSS} ${test.name}` + EOL
      + lib.indent(lib.filterStack(test), ' | ')
  }
}

/**
 * Create a promise for a test function.
 * @param {function} fn - function to execute
 * @param {object} ctx - first argument to pass to the function
 * @return {Promise} A promise to execute function.
 */
async function createTestPromise(fn, ctx) {
  const res = await fn(ctx)
  return res
}

async function plainDestroyContext(test) {
  if (test.context && typeof test.context._destroy === 'function') {
    const res = await test.context._destroy()
    return res
  }
}

/**
 * Asynchronously runs the test
 * @param {Test} test A test to run.
 * @return {Promise.<Test>} A promise resolved with the run test.
 */
async function runTest(test) {
  test.started = new Date()

  try {
    const evaluateContext = test._evaluateContext()
    await promto(evaluateContext, test.timeout, 'Evaluate')

    const run = createTestPromise(test.fn, test.context)
    test.result = await promto(run, test.timeout, 'Test')
  } catch (err) {
    test.error = err
  }

  try {
    const destroyContext = plainDestroyContext(test)
    test.destroyResult = await promto(destroyContext, test.timeout, 'Destroy')
  } catch (err) {
    test.error = err
  }

  test.finished = new Date()
  return test
}

module.exports = Test
