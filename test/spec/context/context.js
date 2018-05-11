import { strictEqual, notStrictEqual, deepEqual } from 'assert'
import throws from 'assert-throws'
import Test from '../../../src/lib/Test'

const testName = 'Zoroaster Context Test'
const testFn = () => { }

function createContext() {
  return {
    name: 'Zarathustra',
    country: 'Iran',
    born: -628,
    died: -551,
  }
}

export const TestEvaluateContextFunction = {
  async 'keeps the context as is for objects'() {
    const context = createContext()
    const test = new Test(testName, testFn, null, context)
    strictEqual(test.context, context)
    await test._evaluateContext()
    strictEqual(test.context, context)
  },
  async 'updates context after resolving async context function'() {
    const context = createContext()
    async function Context() {
      await new Promise(resolve => setTimeout(resolve, 50))
      Object.assign(this, context)
    }
    const test = new Test(testName, testFn, null, Context)
    strictEqual(test.context, Context)
    await test._evaluateContext()
    notStrictEqual(test.context, Context)
    deepEqual(test.context, context)
  },
  async 'updates context after evaluting sync context function'() {
    const context = createContext()
    function Context() {
      Object.assign(this, context)
    }
    const test = new Test(testName, testFn, null, Context)
    strictEqual(test.context, Context)
    await test._evaluateContext()
    notStrictEqual(test.context, Context)
    deepEqual(test.context, context)
  },
  async 'fails the test if evaluation failed'() {
    const error = new Error('test-init-context-error')
    function Context() {
      throw error
    }
    const test = new Test(testName, testFn, null, Context)
    await throws({
      async fn() { await test._evaluateContext() },
      error,
    })
  },
}

// export default {
//   'test suite context': TestSuiteContext,
//   'test context': TestContext,
//   'test suite context from tests': TestSuiteContextFromTests,
//   'test _evaluateContext function': TestEvaluateContextFunction,
// }
