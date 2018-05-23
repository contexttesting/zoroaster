import Zoroaster from '../../src'
import Context from '../context'
import snapshotContext, { SnapshotContext } from 'snapshot-context' // eslint-disable-line no-unused-vars

/** @type {Object.<string, (ctx: Context, snapshotCtx: SnapshotContext)>} */
const T = {
  context: [
    Context,
    snapshotContext,
  ],
  async 'returns correct country of origin'({ getCountry, SNAPSHOT_DIR }, { test, setDir }) {
    setDir(SNAPSHOT_DIR)
    const zoroaster = new Zoroaster()
    const expected = await getCountry()
    const actual = zoroaster.countryOfOrigin
    await test(actual, expected)
  },
}

export default T
