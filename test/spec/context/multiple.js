import { ok, equal } from 'assert'
import TestSuite from '../../../src/lib/TestSuite'
import Context from '../../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'passes multiple contexts to tests'({ runTestSuite }) {
    const testSuite = new TestSuite('test', {
      context: [
        'test',
        // null, expect an error with null
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
      testA(S, { data: A }, { data: B }, { data: C }) {
        equal(S, 'test')
        equal(A, 'A')
        equal(B, 'B')
        equal(C, 'C')
      },
    })
    await runTestSuite(testSuite)
  },
  async 'destroys multiple contexts'({ runTestSuite, tests: { asyncTest } }) {
    let calledA
    let calledB
    let calledC
    const testSuite = new TestSuite('test', {
      context: [
        'a string', // OK
        // null, // please no
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
      asyncTest,
    })
    await runTestSuite(testSuite)
    ok(calledA)
    ok(calledB)
    ok(calledC)
  },
}

export default T
