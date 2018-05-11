import { equal } from 'assert'
import TestSuite from '../../../src/lib/TestSuite'
import context, { Context } from '../../context' // eslint-disable-line no-unused-vars

/** @type {Object.<string, (ctx: Context)>} */
const t = {
  context,
  async 'passes multiple contexts to tests'(ctx) {
    const testSuite = new TestSuite('test', {
      context: [
        async function contextA() {
          this.data = 'A'
        },
        async function contextB() {
          this.data = 'B'
        },
      ],
      testA({ data: A }, { data: B }) {
        equal(A, 'A')
        equal(B, 'B')
      },
    })
    await testSuite.run()
    ctx.assertNoErrorsInTestSuite(testSuite)
  },
  async 'destroys multiple contexts'(ctx) {
    let calledA
    let calledB
    const testSuite = new TestSuite('test', {
      context: [
        async function contextA() {
          this._destroy = () => { calledA = true }
        },
        async function contextB() {
          this._destroy = () => { calledB = true }
        },
      ],
      testA() {
        equal(1, 1)
      },
    })
    await testSuite.run()
    ctx.assertNoErrorsInTestSuite(testSuite)
    equal(calledA, true)
    equal(calledB, true)
  },
}

export default t
