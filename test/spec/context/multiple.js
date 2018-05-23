import { ok, equal } from 'assert'
import TestSuite from '../../../src/lib/TestSuite'
import context, { Context } from '../../context' // eslint-disable-line no-unused-vars

/** @type {Object.<string, (ctx: Context)>} */
const T = {
  context,
  async 'passes multiple contexts to tests'({ assertNoErrorsInTestSuite }) {
    const testSuite = new TestSuite('test', {
      context: [
        'test',
        { data: 'A' },
        async function ContextB() {
          this.data = 'B'
        },
        class ContextC {
          async _init() {
            this.data = 'C'
          }
        },
      ],
      testA(data, { data: A }, { data: B }, { data: C }) {
        equal(data, 'test')
        equal(A, 'A')
        equal(B, 'B')
        equal(C, 'C')
      },
    })
    await testSuite.run()
    assertNoErrorsInTestSuite(testSuite)
  },
  async 'destroys multiple contexts'({ assertNoErrorsInTestSuite, tests: { test } }) {
    let calledA
    let calledB
    let calledC
    const testSuite = new TestSuite('test', {
      context: [
        {
          _destroy() { calledA = true },
        },
        async function ContextB() {
          this._destroy = () => { calledB = true }
        },
        class ContextC {
          async _destroy() {
            calledC = true
          }
        },
      ],
      test,
    })
    await testSuite.run()
    assertNoErrorsInTestSuite(testSuite)
    ok(calledA)
    ok(calledB)
    ok(calledC)
  },
}

export default T
