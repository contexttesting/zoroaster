import throws from 'assert-throws'
import Context from '../../context'
import makeTestSuite from '../../../src/lib/make-test-suite'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'tests a fork'({ runTest }) {
    const ts = makeTestSuite('test/fixture/result/fork.md', {
      fork: 'test/fixture/fork',
    })
    await runTest(ts, 'forks a module')
    await runTest(ts, 'forks a module with string arguments')
    await throws({
      fn: runTest,
      args: [ts, 'fails on stdout'],
      message: /fail/,
    })
    await throws({
      fn: runTest,
      args: [ts, 'fails on stderr'],
      message: /fail/,
    })
    await throws({
      fn: runTest,
      args: [ts, 'fails on code'],
      message: /Fork exited with code 127 != 1/,
    })
  },
}

export default T