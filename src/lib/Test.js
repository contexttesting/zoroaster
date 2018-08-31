import { EOL } from 'os'
import promto from 'promto'
import { indent, filterStack, destroyContexts, evaluateContext } from '.'

export default class Test {
  /**
   * Create a new test object.
   * @constructor
   * @param {string} name Name of the test.
   * @param {function} fn Function as specified in the specs.
   * @param {Number} timeout Timeout in ms after which to throw the timeout error.
   * @param {object|function} context The context object, function or constructor.
   */
  constructor(name, fn, timeout, context) {
    this.timeout = timeout || 2000
    this.name = name
    this.fn = fn
    this.started = null
    this.finished = null
    this.error = null
    this.result = null

    this.context = context
  }

  /**
   * Run the test.
   * @param {function} notify - notify function
   */
  async run(notify = () => {}, onlyFocused) {
    if (onlyFocused && this.name.startsWith('!')) return
    notify({
      type: 'test-start',
      name: this.name,
    })
    const res = await runTest(this)
    notify({
      test: this,
      type: 'test-end',
      name: this.name,
      result: this.dump(),
      error: this.error,
    })
    return res
  }
  dump() {
    return dumpResult(this)
  }
  hasErrors() {
    return this.error !== null
  }

  /**
   * Evaluate test's context or contexts.
   */
  async _evaluateContext() {
    if (this.context === undefined) {
      this.contexts = []
      return
    }

    if (Array.isArray(this.context)) {
      const ep = this.context.map(evaluateContext)
      this.contexts = await Promise.all(ep)
      return
    }

    const c = await evaluateContext(this.context)
    this.contexts = [c]
  }
}

const TICK = '\x1b[32m \u2713 \x1b[0m'
const CROSS = '\x1b[31m \u2717 \x1b[0m'

function dumpResult(test) {
  if (test.error === null) {
    return `${TICK} ${test.name}`
  } else {
    return `${CROSS} ${test.name}` + EOL
      + indent(filterStack(test), ' | ')
  }
}

/**
 * Create a promise for a test function.
 * @param {function} fn function to execute
 * @param {object[]} ctx Contexts to pass as arguments in order
 * @return {Promise} A promise to execute function.
 */
async function createTestPromise(fn, contexts) {
  const res = await fn(...contexts)
  return res
}

/**
 * Asynchronously runs the test
 * @param {Test} test A test to run.
 * @return {Promise.<Test>} A promise resolved with the run test.
 */
async function runTest(test) {
  test.started = new Date()

  try {
    const evaluate = test._evaluateContext()
    await promto(evaluate, test.timeout, 'Evaluate')

    const run = createTestPromise(test.fn, test.contexts)
    test.result = await promto(run, test.timeout, 'Test')
  } catch (err) {
    test.error = err
  }

  // even if test failed, destroy context
  try {
    const destroy = destroyContexts(test.contexts || []) // if hasn't evaluated
    test.destroyResult = await promto(destroy, test.timeout, 'Destroy')
  } catch (err) {
    test.error = err
  }

  test.finished = new Date()
  return test
}
