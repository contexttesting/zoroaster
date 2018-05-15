import Zoroaster from '../../src'
import context, { Context } from '../context' // eslint-disable-line no-unused-vars
import snapshotContext, { SnapshotContext } from 'snapshot-context' // eslint-disable-line no-unused-vars
import { resolve } from 'path'

const SNAPSHOT_DIR = resolve(__dirname, '../snapshot')

/** @type {Object.<string, (ctx: Context, snapshotCtx: SnapshotContext)>} */
const T = {
  context: [
    context,
    snapshotContext,
  ],
  async 'returns correct country of origin'({ getCountry }, { test, setDir }) {
    setDir(SNAPSHOT_DIR)
    const zoroaster = new Zoroaster()
    const expected = await getCountry()
    const actual = zoroaster.countryOfOrigin
    await test(actual, expected)
  },
}

export default T
