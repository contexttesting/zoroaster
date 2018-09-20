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
  async 'tests a fork with properties'({ runTest }) {
    const t = '--test'
    const e = 'TEST'
    const ts = makeTestSuite('test/fixture/result/fork-options.md', {
      fork: {
        module: 'test/fixture/fork-options',
        getArgs(args, { arg }) {
          return [...args, arg]
        },
        getOptions({ FORK_ENV }) {
          return {
            env: {
              FORK_ENV,
            },
            execArgv: [],
          }
        },
      },
      jsonProps: ['stdout'],
      context: { arg: t, FORK_ENV: e },
    })
    await runTest(ts, 'forks a module')
  },
  async 'fails a fork with options'({ runTest }) {
    const t = '--test'
    const ts = makeTestSuite('test/fixture/result/fork-options.md', {
      fork: {
        module: 'test/fixture/fork-options',
        getArgs(args, { arg }) {
          return [...args, arg]
        },
        options: {
          env: {
            FORK_ENV: 'FAIL',
          },
        },
      },
      jsonProps: ['stdout'],
      context: { arg: t },
    })
    await throws({
      fn: runTest,
      args: [ts, 'forks a module'],
      message: /'FAIL' == 'TEST'/,
    })
  },
}

export default T