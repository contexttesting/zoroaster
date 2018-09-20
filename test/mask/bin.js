import makeTestSuite from '../../src/lib/make-test-suite'
import Context from '../context'

const { BIN, getSnapshot } = Context

const ts = makeTestSuite('test/result/bin.md', {
  fork: {
    module: BIN,
    options: {
      execArgv: [],
    },
  },
  mapActual({ stdout }) {
    const s = getSnapshot(stdout)
    return s
  },
})

export default ts