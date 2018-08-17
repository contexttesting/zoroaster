import throws from 'assert-throws'
import SnapshotContext from 'snapshot-context'
import { equal } from 'assert'
import Context from '../../context'
import makeTestSuite from '../../../src/lib/make-test-suite'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context, SnapshotContext],
  async 'can create a test suite'({ TS_MASK_PATH }) {
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
      async fn() {
        await runTest(ts, 'expected fail')
      },
    })
    equal(called, 2)
    await runTest(ts, 'error pass')
    equal(called, 3)
    await throws({
      async fn() {
        await runTest(ts, 'error fail')
      },
    })
    equal(called, 4)
  },
}


const runTest = async (testSuite, name) => {
  if (!(name in testSuite)) throw new Error('No such test found')
  const con = Array.isArray(testSuite.context) ? testSuite.context : [testSuite.context]

  const ic = await con.reduce(async (acc, C) => {
    await acc
    const c = new C()
    if ('_init' in c) await c._init()
    return [...acc, c]
  }, [])
  const test = testSuite[name]
  await test(...ic)
}

export default T