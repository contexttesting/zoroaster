import throws from 'assert-throws'
import { equal, deepEqual } from 'assert'
import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import makeTestSuite from '../../../src/lib/make-test-suite'
import { inspect } from 'util'
import { Readable, Transform } from 'stream'

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
    const getResults = async (input, { stream }) => {
      const res = await stream(input)
      return res
    }
    const ts = makeTestSuite(TS_MASK_PATH, {
      context: TestContext,
      getThrowsConfig,
      getResults,
      mapActual: ({ string }) => string,
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
      message: /Function stream should have thrown/,
    })
    equal(called, 4)
  },
  async 'asserts on empty result'({ TS_MASK_PATH, runTest }) {
    const ts = makeTestSuite(TS_MASK_PATH, {
      getResults(input) {
        if (input == 'fail') return input
        return ''
      },
    })
    await runTest(ts, 'empty expected')
    await throws({
      fn: runTest,
      args: [ts, 'empty expected fail'],
      message: /'fail' == ''/,
    })
  },
  async 'passes this context to readable'({ TS_MASK_PATH, runTest }) {
    const ts = makeTestSuite(TS_MASK_PATH, {
      getReadable() {
        const { input, ...props } = this
        return new Readable({
          read() {
            this.push(`input: ${input}`)
            Object.keys(props).forEach((k) => {
              this.push(`\n${k}: ${JSON.stringify(props[k])}`)
            })
            this.push(null)
          },
        })
      },
      jsonProps: ['prop'],
    })
    await runTest(ts, 'test properties')
  },
  async 'passes this context to getTransform'({ TS_MASK_PATH, runTest }) {
    const ts = makeTestSuite(TS_MASK_PATH, {
      getTransform() {
        const { input, ...props } = this
        return new Transform({
          transform(data, enc, next) {
            this.push(`input: ${input}`)
            Object.keys(props).forEach((k) => {
              this.push(`\n${k}: ${JSON.stringify(props[k])}`)
            })
            next()
          },
        })
      },
      jsonProps: ['prop'],
    })
    await runTest(ts, 'test properties')
  },
}

/** @type {Object.<string, (c: Context)>} */
const errors = {
  async 'when the actual result is not a string'({ TS_MASK_PATH, runTest }) {
    const ts = makeTestSuite(TS_MASK_PATH, {
      getResults() {
        return {}
      },
    })
    await throws({
      fn: runTest,
      args: [ts, 'expected pass'],
      message: /The actual result is not an a string./,
    })
  },
  async 'when no getThrowsConfig is given'({ TS_MASK_PATH, runTest }) {
    const ts = makeTestSuite(TS_MASK_PATH, {})
    await throws({
      fn: runTest,
      args: [ts, 'error pass'],
      message: /No "getThrowsConfig" function is given./,
    })
  },
  async 'when repeating a test name'({ TS_MASK_PATH, runTest }) {
    const ts = makeTestSuite(TS_MASK_PATH, {})
    await throws({
      fn: runTest,
      args: [ts, 'duplicate name'],
      message: /Repeated use of the test name "duplicate name"/,
    })
  },
  async 'when cannot parse a JSON property'({ TS_MASK_PATH, runTest }) {
    const ts = makeTestSuite(TS_MASK_PATH, {
      getResults: () => { },
      jsonProps: ['json'],
    })
    await throws({
      fn: runTest,
      args: [ts, 'incorrect json'],
      message: /Could not parse JSON property "json"/,
    })
  },
}

/** @type {Object.<string, (c: Context, sc: SnapshotContext)>} */
const assertResults = {
  context: [Context, SnapshotContext],
  async 'can create a test suite from a directory'(
    { MASK_DIR_PATH, SNAPSHOT_DIR }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const ts = makeTestSuite(MASK_DIR_PATH, {
      getResults(input) {
        return input + ' - ok'
      },
    })
    const s = inspect(ts)
    await test('mask-dir.txt', s)
  },
  async 'asserts on results'({ TS_CUSTOM_MASK_PATH, runTest }) {
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
    const ts = makeTestSuite(TS_CUSTOM_MASK_PATH, {
      context: TestContext,
      assertResults(
        { json: actualJson, additional: actualAdditional },
        { additional, json },
      ) {
        if (additional) equal(actualAdditional, additional)
        if (json) deepEqual(actualJson, json)
      },
      async getResults(input, { stream }) {
        const res = await stream(input)
        return res
      },
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
  ...assertResults,
  errors,
}