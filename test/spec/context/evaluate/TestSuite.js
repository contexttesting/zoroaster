import { ok, equal, notStrictEqual, throws } from 'assert'
import TestSuite from '../../../../src/lib/TestSuite'
import Context from '../../../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'evaluates context for each test'({ TEST_SUITE_NAME, assertNoErrorsInTestSuite }) {
    const testData = 'some-test-data'
    const newTestData = 'some-new-test-data'
    const propName = 'testData'
    let getterCalled = false
    let setterCalled = false
    let firstContext
    let secondContext

    function c() {
      let _testData = testData
      getterCalled = false
      setterCalled = false
      Object.defineProperty(this, propName, {
        get: () => {
          getterCalled = true
          return _testData
        },
        set: (value) => {
          setterCalled = true
          _testData = value
        },
      })
    }

    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      testA(ctx) {
        ok(!getterCalled)
        ok(!setterCalled)
        equal(ctx.testData, testData)
        ok(getterCalled)
        ctx.testData = newTestData
        ok(setterCalled)
        equal(ctx.testData, newTestData)
        firstContext = ctx
      },
      testB(ctx) { // context is called each time for every test
        ok(!getterCalled)
        ok(!setterCalled)
        equal(ctx.testData, testData)
        ok(getterCalled)
        secondContext = ctx
      },
    }, null, c)
    await testSuite.run()
    assertNoErrorsInTestSuite(testSuite)
    notStrictEqual(firstContext, secondContext)
    equal(firstContext[propName], newTestData)
    equal(secondContext[propName], testData)
  },
  async 'evaluates context for each test (as prop)'({ TEST_SUITE_NAME, assertNoErrorsInTestSuite }) {
    const testData = 'some-test-data'
    const newTestData = 'some-new-test-data'
    const propName = 'testData'
    let getterCalled = false
    let setterCalled = false
    let firstContext
    let secondContext

    function c() {
      let _testData = testData
      getterCalled = false
      setterCalled = false
      Object.defineProperty(this, propName, {
        get: () => {
          getterCalled = true
          return _testData
        },
        set: (value) => {
          setterCalled = true
          _testData = value
        },
      })
    }

    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      context: c,
      testA(ctx) {
        ok(!getterCalled)
        ok(!setterCalled)
        equal(ctx.testData, testData)
        ok(getterCalled)
        ctx.testData = newTestData
        ok(setterCalled)
        equal(ctx.testData, newTestData)
        firstContext = ctx
      },
      testB(ctx) { // context is called each time for every test
        ok(!getterCalled)
        ok(!setterCalled)
        equal(ctx.testData, testData)
        ok(getterCalled)
        secondContext = ctx
      },
    })
    await testSuite.run()
    assertNoErrorsInTestSuite(testSuite)
    notStrictEqual(firstContext, secondContext)
    equal(firstContext[propName], newTestData)
    equal(secondContext[propName], testData)
  },
  async 'waits until promise returned by context is resolved'({ TEST_SUITE_NAME, assertNoErrorsInTestSuite }) {
    const testData = 'some-test-data'
    const testDataAfterPromise = 'test-data-after-promise'
    const newTestData = 'some-new-test-data'
    let firstContext
    let secondContext
    const propName = 'testData'

    async function c() {
      let _testData = testData
      Object.defineProperty(this, propName, {
        get: () => {
          return _testData
        },
        set: (value) => {
          _testData = value
        },
      })
      await new Promise(r => {
        setTimeout(() => {
          _testData = testDataAfterPromise
          r()
        }, 50)
      })
    }

    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      context: c,
      testA(ctx) {
        equal(ctx.testData, testDataAfterPromise)
        ctx.testData = newTestData
        firstContext = ctx
      },
      testB(ctx) {
        equal(ctx.testData, testDataAfterPromise)
        secondContext = ctx
      },
    })
    await testSuite.run()
    assertNoErrorsInTestSuite(testSuite)
    notStrictEqual(firstContext, secondContext)
    equal(firstContext[propName], newTestData)
    equal(secondContext[propName], testDataAfterPromise)
  },
  async 'times out before context finishes evaluating'(
    { TEST_SUITE_NAME, assertNoErrorsInTestSuite, tests: { test } }
  ) {
    async function c() {
      await new Promise(r => setTimeout(r, 200))
    }
    const ts = new TestSuite(TEST_SUITE_NAME, {
      test,
    }, null, c, 150)
    await ts.run()
    throws(
      () => assertNoErrorsInTestSuite(ts),
      /Error in test "Zoroaster Test Suite Name > test": Evaluate has timed out after 150ms/
    )
  },
}

export default T
