import { equal, ok } from 'assert'
import TestSuite from '../../../src/lib/TestSuite'
import context from '../../context'

/** @type {Object.<string, (ctx: context)>} */
const T = {
  context,
  async 'evaluates a class constructor'({ TEST_SUITE_NAME, assertNoErrorsInTestSuite }) {
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
  async 'binds the methods'({ TEST_SUITE_NAME, assertNoErrorsInTestSuite }) {
    class Test {
      async _init() {
        await new Promise(r => setTimeout(r, 100))
        this.init = true
      }
      get isInit() {
        return this.init
      }
      getData() {
        return this._data
      }
      setData(d) {
        this._data = d
      }
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      context: Test,
      testA({ getData, setData }) {
        const t = 'test'
        setData(t)
        const d = getData()
        equal(d, t)
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
