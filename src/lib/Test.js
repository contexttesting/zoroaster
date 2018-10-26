import { runTest } from '@zoroaster/reducer'
import { EOL } from 'os'
import { TICK, CROSS, indent, filterStack } from '.'

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
    this.fn = fn
    this.context = context
  }

  /**
   * Run the test.
   * @param {function} [notify] - notify function
   */
  async run(notify) {
    const { name } = this
    if (notify) notify({
      name,
      type: 'test-start',
    })
    const res = await runTest({
      context: this.context,
      fn: this.fn,
      timeout: this.timeout,
      name: this.name,
    })
    const { error } = res
    if (notify) notify({
      test: this,
      name,
      error,
      type: 'test-end',
      result: dumpResult({ error, name }),
    })
    Object.assign(this, res)
    return res
  }

  hasErrors() {
    return this.error !== null
  }

  get isFocused() {
    return this.name.startsWith('!')
  }
}

export function dumpResult({ error, name }) {
  if (error === null) {
    return `${TICK} ${name}`
  } else {
    return `${CROSS} ${name}` + EOL
      + indent(filterStack({ error, name }), ' | ')
  }
}

/**
 * @typedef {import('@zoroaster/types').ContextConstructor} ContextConstructor
 * @typedef {import('@zoroaster/types').Context} Context
 */