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
  'creates a test with a context'({ createObjectContext, TEST_NAME, tests: { test } }) {
    const ctx = createObjectContext()
    const t = new Test(TEST_NAME, test, null, ctx)
    strictEqual(t.context, ctx)
  },
  async 'passes context as first argument to function'({ createObjectContext, TEST_NAME }) {
    const ctx = createObjectContext()
    const t = (c) => {
      equal(c, ctx)
    }
    const test = new Test(TEST_NAME, t, null, ctx)
    await test.run()
    equal(test.error, null)
  },
}

export default T
