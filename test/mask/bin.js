import makeTestSuite from '../../src/lib/make-test-suite'
import Context from '../context'

const { BIN, getSnapshot } = Context

const ts = makeTestSuite('test/result/bin.md', {
  fork: BIN,
  mapActual({ stdout }) {
    const s = getSnapshot(stdout)
    return s
  },
  splitRe: /^## /gm,
})

export default ts