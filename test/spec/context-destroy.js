const assert = require('assert')
const TestSuite = require('../../src/test_suite')
const lib = require('../lib')

const TEST_SUITE_NAME = 'test-suite'

const ObjectContext = {
  async 'calls _destroy'() {
    let destroyed = false
    const Context = {
      _destroy() { destroyed = true },
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      test: () => {},
    }, null, Context)
    await testSuite.run()
    lib.assertNoErrosInTestSuite(testSuite)
    assert(destroyed)
  },
  async 'calls async _destroy'() {
    let destroyed = false
    const Context = {
      async _destroy() {
        await new Promise(r => setTimeout(r, 50))
        destroyed = true
      },
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      test: () => {},
    }, null, Context)
    await testSuite.run()
    lib.assertNoErrosInTestSuite(testSuite)
    assert(destroyed)
  },
}

const FunctionContext = {
  async 'calls _destroy'() {
    let destroyed = false
    function Context() {
      this._destroy = () => {
        destroyed = true
      }
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      test: () => {},
    }, null, Context)
    await testSuite.run()
    lib.assertNoErrosInTestSuite(testSuite)
    assert(destroyed)
  },
  async 'calls async _destroy'() {
    let destroyed = false
    function Context() {
      this._destroy = async () => {
        await new Promise(r => setTimeout(r, 50))
        destroyed = true
      }
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      test: () => {},
    }, null, Context)
    await testSuite.run()
    lib.assertNoErrosInTestSuite(testSuite)
    assert(destroyed)
  },
  async 'fails the test when _destroy throws an error'() {
    const error = new Error('test error message')
    function Context() {
      this._destroy = () => {
        throw error
      }
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      test: () => {},
    }, null, Context)
    await testSuite.run()
    assert.strictEqual(testSuite.tests[0].error, error)
  },
  async 'fails the test when async _destroy throws an error'() {
    const error = new Error('test error message')
    function Context() {
      this._destroy = async () => {
        throw error
      }
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      test: () => {},
    }, null, Context)
    await testSuite.run()
    assert.strictEqual(testSuite.tests[0].error, error)
  },
  async 'times out if _destroy is taking too long'() {
    let destroyed = false
    function Context () {
      this._destroy = async () => {
        await new Promise(r => setTimeout(r, 500))
        destroyed = true
      }
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      'should timeout'() {},
    }, null, Context, 250)
    await testSuite.run()

    assert.throws(
      () => lib.assertNoErrosInTestSuite(testSuite),
      /Error in test "test-suite > should timeout": Destroy has timed out after 250ms/
    )
    assert(!destroyed)
  },
  async 'calls _destroy after test timeout'() {
    let destroyed = false
    function Context () {
      this._destroy = () => {
        destroyed = true
      }
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      async 'should timeout'() {
        await new Promise(r => setTimeout(r, 500))
      },
    }, null, Context, 250)
    await testSuite.run()
    assert.throws(
      () => lib.assertNoErrosInTestSuite(testSuite),
      /Error in test "test-suite > should timeout": Test has timed out after 250ms/
    )
    assert(destroyed)
  },
  async 'updates test\'s destroyResult'() {
    const destroyReturnValue = 'test-value'
    function Context() {
      this._destroy = () => destroyReturnValue
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      'should pass'() {},
    }, null, Context)
    await testSuite.run()
    assert.equal(testSuite.tests[0].destroyResult, destroyReturnValue)
  },
}

module.exports = {
  FunctionContext,
  ObjectContext,
}
