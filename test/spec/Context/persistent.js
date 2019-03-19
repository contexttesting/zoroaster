import { ok, equal } from 'assert'
import TestSuite from '../../../src/lib/TestSuite'
import Context from '../../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'creates an instance of a class'({ TEST_SUITE_NAME, runTestSuite }) {
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
      persistentContext: Test,
      /**
       * @param {Test} t
       */
      testA({ isInit }) {
        ok(isInit)
      },
    })
    await runTestSuite(testSuite)
  },
  async 'destroys the context'({ TEST_SUITE_NAME, tests: { asyncTest }, runTestSuite }) {
    let destroyed = false
    class Test {
      async _destroy() {
        await new Promise(r => setTimeout(r, 100))
        destroyed = true
      }
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      persistentContext: Test,
      asyncTest,
    })
    await runTestSuite(testSuite)
    ok(destroyed)
  },
  async 'works with multiple'({ TEST_SUITE_NAME, runTestSuite }) {
    let firstInit = false, firstDestroy = false
    let secondInit = false, secondDestroy = false
    class Test {
      async _init() {
        await new Promise(r => setTimeout(r, 100))
        firstInit = true
      }
      async _destroy() {
        await new Promise(r => setTimeout(r, 100))
        firstDestroy = true
      }
      get A() {
        return 'A'
      }
    }
    class Test2 {
      async _init() {
        await new Promise(r => setTimeout(r, 100))
        secondInit = true
      }
      async _destroy() {
        await new Promise(r => setTimeout(r, 100))
        secondDestroy = true
      }
      get B() {
        return 'B'
      }
    }

    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      persistentContext: [Test, Test2],
      /**
       * @param {Test} t
       * @param {Test2} tt
       */
      test({ A }, { B }) {
        equal(A, 'A')
        equal(B, 'B')
      },
    })
    await runTestSuite(testSuite)
    ok(firstInit)
    ok(secondInit)
    ok(firstDestroy)
    ok(secondDestroy)
  },
}

export default T
