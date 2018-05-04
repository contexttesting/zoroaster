const { equal } = require('assert')
const TestSuite = require('../../src/test_suite')
const { assertNoErrorsInTestSuite } = require('../lib')

const multipleContextTestSuite = {
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

module.exports = multipleContextTestSuite
