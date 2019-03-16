import makeTestSuite from '@zoroaster/mask'
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