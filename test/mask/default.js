import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import Context from '../context'

const { BIN, getSnapshot } = Context

export default makeTestSuite('test/result/timeouts', {
  fork: {
    module: BIN,
    preprocess: {
      stdout: getSnapshot,
    },
  },
})

export const errors = makeTestSuite('test/result/errors', {
  context: TempContext,
  fork: {
    module: BIN,
    /** @param {Array<string>} */
    /** @param {TempContext} */
    async getArgs(args, { write }) {
      const path = await write('test.js', this.input)
      return [path, '-a']
    },
    preprocess: {
      stdout: getSnapshot,
    },
  },
})

export const watch = makeTestSuite('test/result/watch', {
  context: TempContext,
  fork: {
    module: BIN,
    /**
     * @param {Array<string>}
     * @param {TempContext}
     */
    async getArgs(args, { write }) {
      const path = await write('test.js', this.input)
      const support = await write('support.js', this.support)
      return [path, support, '-a', '-w']
    },
    /**
     * @param {TempContext}
     */
    getOptions({ resolve }) {
      return {
        env: {
          TEST_SUITE_PATH: resolve('test.js'),
        },
      }
    },
    inputs: [
      [/Delete/, 'y'],
      [/Exit/, 'n'],
      [/Exit/, 'y'],
    ],
    preprocess: {
      stdout: getSnapshot,
      stderr: Context.preprocessStderr,
    },
  },
})