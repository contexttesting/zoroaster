import Zoroaster from '../../src'
import Context from '../context'
import SnapshotContext from 'snapshot-context'

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'returns correct country of origin'(
    { SNAPSHOT_DIR }, { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const zoroaster = new Zoroaster()
    const actual = zoroaster.countryOfOrigin
    await test('country-of-origin.txt', actual)
  },
}

export default T
