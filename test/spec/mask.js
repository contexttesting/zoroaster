import SnapshotContext from 'snapshot-context'
import Context from '../context'
import { getTests } from '../../src'

/** @type {Object.<string, (c: Context, sc: SnapshotContext)>} */
const T = {
  context: [Context, SnapshotContext],
  async 'can make a mask'({ MASK_PATH, SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const res = getTests(MASK_PATH, ['expected', 'exports'])
    await test('mask.json', res)
  },
}

export default T