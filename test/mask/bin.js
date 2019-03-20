import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import { join } from 'path'
import { ensurePath } from '@wrote/wrote'
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

/**
 * @param {string}
 * @param {TempContext} t
 */
const getResults = async (_, { snapshot: s }) => {
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
      await ensurePath(join(TEMP, p))
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