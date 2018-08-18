import throws from 'assert-throws'
import { equal, deepEqual } from 'assert'
import Context from '../../context'
import makeTestSuite from '../../../src/lib/make-test-suite'

/** @type {Object.<string, (c: Context)>} */
const expectedAndError = {
  context: Context,
  async 'can create a test suite'({ TS_MASK_PATH, runTest }) {
    const t = 'pass'
    let called = 0

    class TestContext {
      async stream(input) {
        called++
        const string = `${input} - ${t}`
        if (input.startsWith('!')) throw new Error(string)
        return {
          string,
        }
      }
    }
    const getThrowsConfig = (input, { stream }) => {
      return {
        fn: stream,
        args: [input],
      }
    }
    const getActual = async (input, { stream }) => {
      const { string } = await stream(input)
      return string
    }
    const ts = makeTestSuite(TS_MASK_PATH, {
      getThrowsConfig,
      getActual,
      context: TestContext,
    })
    await runTest(ts, 'expected pass')
    equal(called, 1)
    await throws({
      fn: runTest,
      args: [ts, 'expected fail'],
      message: /an input to expected - pass' == 'an input to expected - fail/,
    })
    equal(called, 2)
    await runTest(ts, 'error pass')
    equal(called, 3)
    await throws({
      fn: runTest,
      args: [ts, 'error fail'],
      message: /Function should have thrown/,
    })
    equal(called, 4)
  },
}

/** @type {Object.<string, (c: Context)>} */
const custom = {
  context: Context,
  async 'allows to run custom tests'({ TS_CUSTOM_MASK_PATH, runTest }) {
    const t = 'pass'
    let called = 0

    class TestContext {
      async stream(input) {
        called++
        const json = input
          .split(', ')
          .map(a => a.startsWith('!') ? a : `${a} - ${t}`)
        return {
          json,
          additional: json.join(', '),
        }
      }
    }
    const customTest = async (input, { additional, json }, { stream }) => {
      const { additional: actual, json: actualJson } = await stream(input)
      if (additional) equal(actual, additional)
      if (json) deepEqual(actualJson, json)
    }
    const ts = makeTestSuite(TS_CUSTOM_MASK_PATH, {
      context: TestContext,
      customTest,
      customProps: ['additional'],
      jsonProps: ['json'],
    })
    await runTest(ts, 'additional pass')
    equal(called, 1)
    await throws({
      fn: runTest,
      args: [ts, 'additional fail'],
      message: /!hello, !world' == 'hello - pass, world - pass/,
    })
    equal(called, 2)
    await runTest(ts, 'json pass')
    equal(called, 3)
    await throws({
      fn: runTest,
      args: [ts, 'json fail'],
      message: /\[ '!hello', '!world' ] deepEqual \[ 'hello - pass', 'world - pass' ]/,
    })
    equal(called, 4)
  },
}

export default {
  ...expectedAndError,
  ...custom,
}