import { Transform } from 'stream'
import throws from 'assert-throws'
import Context from '../../context'
import makeTestSuite from '../../../src/lib/make-test-suite'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'can stream the result'({ runTest }) {
    const ts = makeTestSuite('test/fixture/result/index.md', {
      streamResult({ test }) {
        const t = new Transform({
          transform(chunk, encoding, next) {
            const r = `${chunk}`.replace(/input/, 'output')
            const rr = `${r}: ${test}`
            this.push(rr)
            next()
          },
        })
        return t
      },
      context: { test: 'pass' },
    })
    await runTest(ts, 'can stream result of a masked test suite')
    await throws({
      fn: runTest,
      args: [ts, 'can stream result of a masked test suite with an error'],
      message: /this is a test output: pass' == 'this is a test output: fail/,
    })
  },
  async 'displays the error from the stream'({ runTest }) {
    const ts = makeTestSuite('test/fixture/result/index.md', {
      streamResult({ test }) {
        const t = new Transform({
          transform(chunk, encoding, next) {
            next(new Error(`test-error: ${test}`))
          },
        })
        return t
      },
      context: { test: 'pass' },
    })
    await throws({
      fn: runTest,
      args: [ts, 'displays correct error'],
      message: /test-error: pass/,
    })
  },
}

export default T