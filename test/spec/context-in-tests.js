import assert from 'assert'
import TestSuite from '../../src/test_suite'
import lib from '../lib'
const TEST_SUITE_NAME = 'test-suite'

const t = {
  async 'executes context as a function in each test'() {
    const testData = 'some-test-data'
    const newTestData = 'some-new-test-data'
    const propName = 'testData'
    let getterCalled = false
    let setterCalled = false
    let firstContext
    let secondContext

    function Context() {
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
        assert(!getterCalled)
        assert(!setterCalled)
        assert.equal(ctx.testData, testData)
        assert(getterCalled)
        ctx.testData = newTestData
        assert(setterCalled)
        assert.equal(ctx.testData, newTestData)
        firstContext = ctx
      },
      testB(ctx) { // context is called each time for every test
        assert(!getterCalled)
        assert(!setterCalled)
        assert.equal(ctx.testData, testData)
        assert(getterCalled)
        secondContext = ctx
      },
    }, null, Context)
    await testSuite.run()
    lib.assertNoErrorsInTestSuite(testSuite)
    assert.notStrictEqual(firstContext, secondContext)
    assert.equal(firstContext[propName], newTestData)
    assert.equal(secondContext[propName], testData)
  },
  async 'executes context as a function in each test (as prop)'() {
    const testData = 'some-test-data'
    const newTestData = 'some-new-test-data'
    const propName = 'testData'
    let getterCalled = false
    let setterCalled = false
    let firstContext
    let secondContext

    function Context() {
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
      context: Context,
      testA(ctx) {
        assert(!getterCalled)
        assert(!setterCalled)
        assert.equal(ctx.testData, testData)
        assert(getterCalled)
        ctx.testData = newTestData
        assert(setterCalled)
        assert.equal(ctx.testData, newTestData)
        firstContext = ctx
      },
      testB(ctx) { // context is called each time for every test
        assert(!getterCalled)
        assert(!setterCalled)
        assert.equal(ctx.testData, testData)
        assert(getterCalled)
        secondContext = ctx
      },
    })
    await testSuite.run()
    lib.assertNoErrorsInTestSuite(testSuite)
    assert.notStrictEqual(firstContext, secondContext)
    assert.equal(firstContext[propName], newTestData)
    assert.equal(secondContext[propName], testData)
  },
  async 'waits until promise returned by context is resolved'() {
    const testData = 'some-test-data'
    const testDataAfterPromise = 'test-data-after-promise'
    const newTestData = 'some-new-test-data'
    let firstContext
    let secondContext
    const propName = 'testData'

    async function Context() {
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
      context: Context,
      testA(ctx) {
        assert.equal(ctx.testData, testDataAfterPromise)
        ctx.testData = newTestData
        firstContext = ctx
      },
      testB(ctx) {
        assert.equal(ctx.testData, testDataAfterPromise)
        secondContext = ctx
      },
    })
    await testSuite.run()
    lib.assertNoErrorsInTestSuite(testSuite)
    assert.notStrictEqual(firstContext, secondContext)
    assert.equal(firstContext[propName], newTestData)
    assert.equal(secondContext[propName], testDataAfterPromise)
  },
  async 'times out before context finishes resolving'() {
    async function Context() {
      await new Promise(r => setTimeout(r, 200))
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      'should timeout'() { },
    }, null, Context, 150)
    await testSuite.run()
    assert.throws(
      () => lib.assertNoErrorsInTestSuite(testSuite),
      /Error in test "test-suite > should timeout": Evaluate has timed out after 150ms/
    )
  },
}

export default t
