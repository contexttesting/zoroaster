import { strictEqual, notStrictEqual, deepEqual } from 'assert'
import throws from 'assert-throws'
import Test from '../../../../src/lib/Test'
import context, { Context } from '../../../context' // eslint-disable-line no-unused-vars

/** @type {Object.<string, (ctx: Context)>} */
const T = {
  context,
  async 'keeps the object context as is'({ createObjectContext, TEST_NAME, test }) {
    const ctx = createObjectContext()
    const t = new Test(TEST_NAME, test, null, ctx)
    strictEqual(t.context, ctx)
    await t._evaluateContext()
    strictEqual(t.context, ctx)
  },
  async 'evaluates async context'({ createObjectContext, TEST_NAME, test }) {
    const ctx = createObjectContext()
    async function c() {
      await new Promise(resolve => setTimeout(resolve, 50))
      Object.assign(this, ctx)
    }
    const t = new Test(TEST_NAME, test, null, c)
    strictEqual(t.context, c)
    await t._evaluateContext()
    notStrictEqual(t.context, c)
    deepEqual(t.context, ctx)
  },
  async 'evaluates sync context'({ createObjectContext, TEST_NAME, test }) {
    const ctx = createObjectContext()
    function c() {
      Object.assign(this, ctx)
    }
    const t = new Test(TEST_NAME, test, null, c)
    strictEqual(t.context, c)
    await t._evaluateContext()
    notStrictEqual(t.context, c)
    deepEqual(t.context, ctx)
  },
  async 'fails the test if evaluation failed'({ TEST_NAME, test }) {
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
}

export default T
