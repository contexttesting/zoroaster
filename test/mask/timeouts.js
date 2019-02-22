import makeTestSuite from '../../src/lib/make-test-suite'
import Context from '../context'

const { BIN, getSnapshot } = Context

export default makeTestSuite('test/result/timeouts.js', {
  fork: BIN,
  mapActual({ stdout }) {
    const s = getSnapshot(stdout)
    return s
  },
})