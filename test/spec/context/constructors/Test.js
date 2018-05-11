import { equal, throws, strictEqual } from 'assert'
import Test from '../../../../src/lib/Test'
import context, { Context } from '../../../context' // eslint-disable-line no-unused-vars

/** @type {Object.<string, (ctx: Context)>} */
const t = {
  context,
  'throws an error when context passed is not an object'(ctx) {
    throws(
      () => new Test(ctx.TEST_NAME, ctx.test, null, 'context'),
      /Context must be an object./
    )
  },
  'throws an error when context passed is null'(ctx) {
    throws(
      () => new Test(ctx.TEST_NAME, ctx.test, null, null),
      /Context cannot be null./
    )
  },
  'creates a test with a context'(ctx) {
    const context = ctx.createObjectContext()
    const test = new Test(ctx.TEST_NAME, ctx.test, null, context)
    strictEqual(test.context, context)
  },
  async 'passes context as first argument to function'(ctx) {
    const context = ctx.createObjectContext()
    const t = (ctx) => {
      equal(ctx, context)
    }
    const test = new Test(ctx.TEST_NAME, t, null, context)
    await test.run()
    equal(test.error, null)
  },
}

export default t
