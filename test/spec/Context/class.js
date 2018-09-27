import { ok } from 'assert'
import TestSuite from '../../../src/lib/TestSuite'
import Context from '../../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'evaluates a class constructor'({
    TEST_SUITE_NAME, assertNoErrorsInTestSuite,
  }) {
    class Test {
      async _init() {
        await new Promise(r => setTimeout(r, 100))
        this.init = true
      }
      get isInit() {
        return this.init
      }
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      context: Test,
      testA({ isInit }) {
        ok(isInit)
      },
    })
    await testSuite.run()
    assertNoErrorsInTestSuite(testSuite)
  },
  async 'destroys the context'({ TEST_SUITE_NAME, tests: { test } }) {
    let destroyed = false
    class Test {
      async _destroy() {
        await new Promise(r => setTimeout(r, 100))
        destroyed = true
      }
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      context: Test,
      test,
    })
    await testSuite.run()
    ok(destroyed)
  },
}

export default T
