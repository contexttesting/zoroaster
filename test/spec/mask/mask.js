import SnapshotContext from 'snapshot-context'
import Context from '../../context'
import { getTests } from '../../../src'
import { ok } from 'assert'

/** @type {Object.<string, (c: Context, sc: SnapshotContext)>} */
const T = {
  context: [Context, SnapshotContext],
  async 'can make a mask'({ MASK_PATH, SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const res = getTests(MASK_PATH, ['expected', 'exports', 'error'])
    const fr = res.map(({ onError, ...rest }) => {
      ok(onError)
      return rest
    })
    await test('mask.json', fr)
  },
}

export default T