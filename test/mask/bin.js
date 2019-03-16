import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import { join } from 'path'
import Context from '../context'

const { BIN, getSnapshot } = Context

export default makeTestSuite('test/result/bin', {
  fork: {
    module: BIN,
    preprocess: {
      stdout: getSnapshot,
      stderr(stderr) {
        if (stderr.startsWith('Reverting JS')) {
          const [,,,...rest] = stderr.split('\n')
          const se = rest.join('\n')
          return se
        }
        return stderr
      },
    },
  },
})

export const snapshot = makeTestSuite('test/result/snapshot', {
  context: TempContext,
  fork: {
    module: BIN,
    /**
     * @param {string[]}
     * @param {TempContext} t
     */
    async getArgs(args, { TEMP }) {
      return [...args, '-s', join(TEMP, 'snapshot')]
    },
    inputs: [
      [/Save snapshot?/, 'y'],
    ],
    preprocess: {
      stdout: getSnapshot,
    },
  },
  /**
   * @param {string}
   * @param {TempContext} t
   */
  async getResults(_, { snapshot: s }) {
    try {
      return (await s('snapshot')).replace(/\\/g, '/')
    } catch (err) {
      return '\n'
    }
  },
})