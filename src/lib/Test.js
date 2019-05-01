import { c } from 'erte'
import runTestAndNotify from './run-test'

/**
 * @implements {_contextTesting.Test}
 */
export default class Test {
  /**
   * Create a new test object.
   * @param {string} name The name of the test.
   * @param {!Function} fn The function as specified in the specs.
   * @param {number} [timeout=2000] The timeout in ms after which to throw the timeout error.
   * @param {!Array<*>} [context] The contexts as objects, functions or constructors.
   */
  constructor(name, fn, timeout = 2000, context = []) {
    this.timeout = timeout
    this.name = name
    this.fn = fn
    this.context = context
    /** A persistent context evaluated by the test suite. */
    this.persistentContext = null
    this.error = null
  }
  get isFocused() {
    return this.name.startsWith('!')
  }
  // /** @deprecated */
  // async run(notify) {
  //   console.warn(c('Deprecated method Test.run', 'yellow'))
  //   const res = await runTestAndNotify(notify, [], '', [], { name: this.name, fn: this.fn, context: this.context, timeout: this.timeout })
  //   Object.assign(this, res)
  //   return res
  // }
}


/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@zoroaster/types').ContextConstructor} ContextConstructor
 */

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@zoroaster/types').Context} Context
 */