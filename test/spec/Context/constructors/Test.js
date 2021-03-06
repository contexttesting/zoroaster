import { strictEqual } from 'assert'
import Test from '../../../../src/lib/Test'
import Context from '../../../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'creates a test with a context'({ createObjectContext, TEST_NAME, tests: { test } }) {
    const ctx = createObjectContext()
    const t = new Test(TEST_NAME, test, null, ctx)
    strictEqual(t.context, ctx)
  },
  async 'passes context as the first argument to function'({ createObjectContext, TEST_NAME, runATest }) {
    const ctx = createObjectContext()
    const t = (c) => {
      strictEqual(c, ctx)
    }
    const test = new Test(TEST_NAME, t, null, ctx)
    const res = await runATest(test, true)
    strictEqual(res.error, null)
  },
}

export default T
