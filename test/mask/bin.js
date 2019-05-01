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
      stderr: Context.preprocessStderr,
    },
  },
})

/**
 * @param {TempContext} t
 */
const getResults = async ({ snapshot: s }) => {
  try {
    return (await s('snapshot')).replace(/\\/g, '/')
  } catch (err) {
    return '\n'
  }
}

export const snapshot = makeTestSuite('test/result/snapshot', {
  context: TempContext,
  fork: {
    module: BIN,
    /**
     * @param {string[]} args
     * @param {TempContext} t
     */
    async getArgs(args, { TEMP }) {
      const hasS = args.some(a => a == '-s')
      if (hasS) return args
      return [...args, '-s', join(TEMP, 'snapshot')]
    },
    inputs: [
      [/Save snapshot?/, 'y'],
      [/Save snapshot?/, 'y'],
    ],
    options: {
      env: {
        ALAMODE_ENV: process.env.ALAMODE_ENV,
      },
    },
    preprocess: {
      stdout: getSnapshot,
    },
  },
  getResults,
})

export const updateSnapshot = makeTestSuite('test/result/update-snapshot', {
  context: TempContext,
  fork: {
    module: BIN,
    /**
     * @param {string[]}
     * @param {TempContext} t
     */
    async getArgs(args, { TEMP, write }) {
      const p = `snapshot/snapshot-ts-update/updates-current-snapshot-and-passes.${this.existingType}`
      await write(p, this.existingData)
      await write(`snapshot/snapshot-ts-update/does-not-update-current-snapshot-and-fails.${this.existingType}`, this.existingData)
      return [...args, '-s', join(TEMP, 'snapshot')]
    },
    inputs: [ // getInputs in the mask would be nice
      [/Update snapshot/, 'y'],
      [/Update snapshot/, 'n'],
    ],
    preprocess: {
      stdout: getSnapshot,
    },
  },
  getResults,
})