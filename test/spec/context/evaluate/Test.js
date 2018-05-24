import { strictEqual, deepEqual, notStrictEqual } from 'assert'
import throws from 'assert-throws'
import Test from '../../../../src/lib/Test'
import Context from '../../../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'keeps the object context as is'({ context, TEST_NAME, test }) {
    const t = new Test(TEST_NAME, test, null, context)
    strictEqual(t.context, context)
    await t._evaluateContext()
    strictEqual(t.context, context)
    strictEqual(t.contexts[0], context)
  },
  async 'evaluates async context'({ context, to, TEST_NAME, test }) {
    async function c() {
      await to()
      Object.assign(this, context)
    }
    const t = new Test(TEST_NAME, test, null, c)
    strictEqual(t.context, c)
    await t._evaluateContext()
    strictEqual(t.context, c)
    notStrictEqual(t.contexts[0], context)
    deepEqual(t.contexts, [context])
  },
  async 'evaluates context'({ context, TEST_NAME, test }) {
    function c() {
      Object.assign(this, context)
    }
    const t = new Test(TEST_NAME, test, null, c)
    strictEqual(t.context, c)
    await t._evaluateContext()
    strictEqual(t.context, c)
    notStrictEqual(t.contexts[0], context)
    deepEqual(t.contexts, [context])
  },
}

export default T

/** @type {Object.<string, (c: Context)>} */
export const fails = {
  context: Context,
  async 'if evaluation failed'({ TEST_NAME, test }) {
    const error = new Error('test-init-context-error')
    function c() {
      throw error
    }
    const t = new Test(TEST_NAME, test, null, c)
    await throws({
      async fn() {
        await t._evaluateContext()
      },
      error,
    })
  },
  async 'if async evaluation failed'({ to, TEST_NAME, test }) {
    const error = new Error('test-init-context-error')
    async function c() {
      await to()
      throw error
    }
    const t = new Test(TEST_NAME, test, null, c)
    await throws({
      async fn() {
        await t._evaluateContext()
      },
      error,
    })
  },
  async 'if class init failed'({ TEST_NAME, test }) {
    const error = new Error('test-init-context-error')
    class C {
      async _init() {
        throw error
      }
    }
    const t = new Test(TEST_NAME, test, null, C)
    await throws({
      async fn() {
        await t._evaluateContext()
      },
      error,
    })
  },
  async 'if async class init failed'({ to, TEST_NAME, test }) {
    const error = new Error('test-init-context-error')
    class C {
      _init() {
        throw error
      }
    }
    const t = new Test(TEST_NAME, test, null, C)
    await throws({
      async fn() {
        await to()
        await t._evaluateContext()
      },
      error,
    })
  },
}
