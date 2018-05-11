import { equal } from 'assert'
import TestSuite from '../../src/test_suite'
import { assertNoErrorsInTestSuite } from '../lib'

const t = {
  async 'passes multiple contexts to tests'() {
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
    assertNoErrorsInTestSuite(testSuite)
  },
  async 'destroys multiple contexts'() {
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
    assertNoErrorsInTestSuite(testSuite)
    equal(calledA, true)
    equal(calledB, true)
  },
}

export default t
