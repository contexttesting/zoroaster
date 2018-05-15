import { equal, throws, strictEqual } from 'assert'
import Test from '../../../../src/lib/Test'
import context, { Context } from '../../../context' // eslint-disable-line no-unused-vars

/** @type {Object.<string, (ctx: Context)>} */
const T = {
  context,
  'throws an error when context passed is not an object'({ TEST_NAME, tests: { test } }) {
    throws(
      () => new Test(TEST_NAME, test, null, 'context'),
      /Context must be an object./
    )
  },
  'throws an error when context passed is null'({ TEST_NAME, tests: { test } }) {
    throws(
      () => new Test(TEST_NAME, test, null, null),
      /Context cannot be null./
    )
  },
  'creates a test with a context'({ createObjectContext }) {
    const ctx = createObjectContext()
    const test = new Test(ctx.TEST_NAME, ctx.test, null, ctx)
    strictEqual(test.context, context)
  },
  async 'passes context as first argument to function'({ createObjectContext }) {
    const ctx = createObjectContext()
    const t = (c) => {
      equal(c, context)
    }
    const test = new Test(ctx.TEST_NAME, t, null, context)
    await test.run()
    equal(test.error, null)
  },
}

export default T
