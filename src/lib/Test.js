import runTestAndNotify from './run-test'

export default class Test {
  /**
   * Create a new test object.
   * @constructor
   * @param {string} name The name of the test.
   * @param {function} fn The function as specified in the specs.
   * @param {Number} [timeout=2000] The timeout in ms after which to throw the timeout error.
   * @param {ContextConstructor[]} [context] The contexts as objects, functions or constructors.
   */
  constructor(name, fn, timeout = 2000, context = []) {
    this.timeout = timeout
    this.name = name
    this._fn = fn
    this.context = context
  }

  hasErrors() {
    return this.error !== null
  }

  get isFocused() {
    return this.name.startsWith('!')
  }
  get fn() {
    return this._fn
  }
  async run(notify) {
    console.warn('deprecated method run')
    const res = await runTestAndNotify(notify, { name: this.name, fn: this.fn, context: this.context, timeout: this.timeout })
    Object.assign(this, res)
    return res
  }
}


/**
 * @typedef {import('@zoroaster/types').ContextConstructor} ContextConstructor
 * @typedef {import('@zoroaster/types').Context} Context
 */