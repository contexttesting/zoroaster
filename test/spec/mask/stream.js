import { Transform, Readable } from 'stream'
import throws from 'assert-throws'
import Context from '../../context'
import makeTestSuite from '../../../src/lib/make-test-suite'
import { fork } from 'child_process'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'can stream the result'({ runTest }) {
    const ts = makeTestSuite('test/fixture/result/index.md', {
      getTransform({ test }) {
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
      getTransform({ test }) {
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
  async 'uses async getTransform'({ runTest }) {
    const ts = makeTestSuite('test/fixture/result/index.md', {
      async getTransform({ test }) {
        await new Promise(r => setTimeout(r, 100))
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
  async 'gets a readable stream'({ runTest }) {
    const ts = makeTestSuite('test/fixture/result/stream-arg.md', {
      getReadable(input, { test }) {
        const r = new Readable({
          read() {
            this.push(`${input}: ${test}`)
            this.push(null)
          },
        })
        return r
      },
      context: { test: 'pass' },
    })
    await runTest(ts, 'streams result with argument')
  },
  async 'gets an async readable stream'({ runTest }) {
    const ts = makeTestSuite('test/fixture/result/stream-arg.md', {
      async getReadable(input, { test }) {
        await new Promise(r => setTimeout(r, 100))
        const r = new Readable({
          read() {
            this.push(`${input}: ${test}`)
            this.push(null)
          },
        })
        return r
      },
      context: { test: 'pass' },
    })
    await runTest(ts, 'streams result with argument')
  },
  async 'tests a readable fork'({ runTest }) {
    const ts = makeTestSuite('test/fixture/result/stream-arg.md', {
      getReadable(input) {
        const proc = fork('test/fixture/echo', [input], {
          stdio: 'pipe',
          execArgv: [],
        })
        return proc.stdout
      },
    })
    await runTest(ts, 'streams to a fork')
  },
}

export default T