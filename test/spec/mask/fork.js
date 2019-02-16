import throws from 'assert-throws'
import Context from '../../context'
import TempContext from 'temp-context'
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

/** @type {Object.<string, (c: Context, t: TempContext )>} */
export const ThisContext = {
  context: [Context, TempContext],
  async 'assigns context on getArgs and getOptions'({ runTest }, { write }) {
    const p = await write('test.js', 'console.log(`stdout: ${process.argv[2]}`); console.error(`stderr: ${process.env.TEST}`)')
    const ts = makeTestSuite('test/fixture/result/this-context.md', {
      fork: {
        module: p,
        getArgs() {
          return [this.input]
        },
        getOptions() {
          return {
            env: {
              TEST: this.config.proc,
            },
          }
        },
      },
      jsonProps: ['config'],
    })
    await runTest(ts, '!assigns the input to this.input')
  },
}

const FORK_INPUT = 'test/fixture/result/fork-input.md'

export const inputs = {
  context: [Context, FORK_INPUT],
  async 'passes inputs to stdin'({ runTest }, result) {
    const ts = makeTestSuite(result, {
      fork: {
        module: 'test/fixture/fork-inputs',
        inputs: [
          [/Answer 1/, 'input1'],
          [/Answer 2/, 'input2'],
        ],
      },
      mapActual({ stdout }) {
        return stdout.trim()
      },
    })
    await runTest(ts, 'writes inputs')
  },
  async 'passes inputs to stdin without logging answers'({ runTest }, result) {
    const ts = makeTestSuite(result, {
      fork: {
        module: 'test/fixture/fork-inputs',
        inputs: [
          [/Answer 1/, 'input1'],
          [/Answer 2/, 'input2'],
        ],
        includeAnswers: false,
      },
      mapActual({ stdout }) {
        return stdout.trim()
      },
    })
    await runTest(ts, 'writes inputs without answers')
  },
  async 'passes inputs to stdin on stderr'({ runTest }, result) {
    const ts = makeTestSuite(result, {
      fork: {
        module: 'test/fixture/fork-inputs-stderr',
        stderrInputs: [
          [/Answer 1/, 'input1'],
        ],
      },
      mapActual({ stderr }) {
        return stderr.trim()
      },
    })
    await runTest(ts, 'writes inputs on stderr')
  },
  async 'passes inputs from the mask property'({ runTest }, result) {
    const ts = makeTestSuite(result, {
      fork: {
        module: 'test/fixture/fork-inputs',
      },
      mapActual({ stdout }) {
        return stdout.trim()
      },
    })
    await runTest(ts, '!writes inputs from props')
  },
}

export default T