import { ok, equal, strictEqual, throws } from 'assert'
import TestSuite from '../../../src/lib/TestSuite'
import Context from '../../context'

/** @type {Object.<string, (c: Context)>} */
export const ObjectContext = {
  context: Context,
  async 'calls _destroy'({ assertNoErrorsInTestSuite, TEST_SUITE_NAME, tests: { test } }) {
    let destroyed = false
    const c = {
      _destroy() { destroyed = true },
    }
    const ts = new TestSuite(TEST_SUITE_NAME, { test }, null, c)
    await ts.run()
    assertNoErrorsInTestSuite(ts)
    ok(destroyed)
  },
  async 'calls async _destroy'({ TEST_SUITE_NAME, assertNoErrorsInTestSuite, tests: { test } }) {
    let destroyed = false
    const c = {
      async _destroy() {
        await new Promise(r => setTimeout(r, 50))
        destroyed = true
      },
    }
    const ts = new TestSuite(TEST_SUITE_NAME, { test }, null, c)
    await ts.run()
    assertNoErrorsInTestSuite(ts)
    ok(destroyed)
  },
}

/** @type {Object.<string, (c: Context)>} */
export const FunctionContext = {
  context: Context,
  async 'calls _destroy'({ TEST_SUITE_NAME, assertNoErrorsInTestSuite, tests: { test } }) {
    let destroyed = false
    function c() {
      this._destroy = () => {
        destroyed = true
      }
    }
    const ts = new TestSuite(TEST_SUITE_NAME, { test }, null, c)
    await ts.run()
    assertNoErrorsInTestSuite(ts)
    ok(destroyed)
  },
  async 'calls async _destroy'({ TEST_SUITE_NAME, assertNoErrorsInTestSuite, tests: { test } }) {
    let destroyed = false
    function c() {
      this._destroy = async () => {
        await new Promise(r => setTimeout(r, 50))
        destroyed = true
      }
    }
    const ts = new TestSuite(TEST_SUITE_NAME, { test }, null, c)
    await ts.run()
    assertNoErrorsInTestSuite(ts)
    ok(destroyed)
  },
  async 'fails the test when _destroy throws an error'({ TEST_SUITE_NAME, tests: { test } }) {
    const error = new Error('test error message')
    function c() {
      this._destroy = () => {
        throw error
      }
    }
    const ts = new TestSuite(TEST_SUITE_NAME, { test }, null, c)
    await ts.run()
    strictEqual(ts.tests[0].error, error)
  },
  async 'fails the test when async _destroy throws an error'({ TEST_SUITE_NAME, tests: { test } }) {
    const error = new Error('test error message')
    function c() {
      this._destroy = async () => {
        throw error
      }
    }
    const ts = new TestSuite(TEST_SUITE_NAME, { test }, null, c)
    await ts.run()
    strictEqual(ts.tests[0].error, error)
  },
  async 'times out if _destroy is taking too long'({ TEST_SUITE_NAME, assertNoErrorsInTestSuite, tests: { test } }) {
    let destroyed = false
    function c () {
      this._destroy = async () => {
        await new Promise(r => setTimeout(r, 500))
        destroyed = true
      }
    }
    const ts = new TestSuite(TEST_SUITE_NAME, {
      test,
    }, null, c, 250)
    await ts.run()

    const re = new RegExp(`Error in test "${TEST_SUITE_NAME} > test": Destroy has timed out after 250ms`)
    throws(
      () => assertNoErrorsInTestSuite(ts),
      re,
    )
    ok(!destroyed)
  },
  async 'calls _destroy after test timeout'({ TEST_SUITE_NAME, assertNoErrorsInTestSuite }) {
    let destroyed = false
    function c() {
      this._destroy = () => {
        destroyed = true
      }
    }
    const ts = new TestSuite(TEST_SUITE_NAME, {
      async 'should timeout'() {
        await new Promise(r => setTimeout(r, 500))
      },
    }, null, c, 250)
    await ts.run()

    const re = new RegExp(`Error in test "${TEST_SUITE_NAME} > should timeout": Test has timed out after 250ms`)
    throws(
      () => assertNoErrorsInTestSuite(ts),
      re
    )
    ok(destroyed)
  },
  async 'updates test\'s destroyResult'({ TEST_SUITE_NAME }) {
    const destroyReturnValue = 'test-value'
    function c() {
      this._destroy = () => destroyReturnValue
    }
    const ts = new TestSuite(TEST_SUITE_NAME, {
      'should pass'() {},
    }, null, c)
    await ts.run()
    equal(ts.tests[0].destroyResult, destroyReturnValue)
  },
}
