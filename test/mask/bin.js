import { equal } from 'assert'
import makeTestSuite from '@zoroaster/mask'
import Context from '../context'

const { BIN, getSnapshot } = Context

const ts = makeTestSuite('test/result/bin', {
  fork: BIN,
  mapActual({ stdout }) {
    const s = getSnapshot(stdout)
    return s
  },
  assertResults({ stderr }, { realStderr }) {
    if (!realStderr) return
    let se = stderr
    if (stderr.startsWith('Reverting JS')) {
      const [,,,...rest] = stderr.split('\n')
      se = rest.join('\n')
    }
    equal(se, realStderr)
  },
  splitRe: /^## /gm,
})

export default ts