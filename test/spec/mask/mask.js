import SnapshotContext from 'snapshot-context'
import { ok } from 'assert'
import Context from '../../context'
import getTests from '../../../src/lib/mask'

/** @type {Object.<string, (c: Context, sc: SnapshotContext)>} */
const T = {
  context: [Context, SnapshotContext],
  async 'can make a mask'({ MASK_PATH, SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const res = getTests({ path: MASK_PATH })
    const fr = res.map(({ onError, ...rest }) => {
      ok(onError)
      return rest
    })
    await test('mask.json', fr)
  },
  async 'can make a mask with a separator'(
    { MASK_SPLIT_PATH, SNAPSHOT_DIR }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const res = getTests({ path: MASK_SPLIT_PATH, splitRe: /^\/\/\/ /mg })
    const fr = res.map(({ onError, ...rest }) => {
      ok(onError)
      return rest
    })
    await test('mask-nl.json', fr)
  },
  async 'can make a mask with a new line'(
    { MASK_NL_PATH, SNAPSHOT_DIR }, { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const res = getTests({ path: MASK_NL_PATH })
    const fr = res.map(({ onError, ...rest }) => {
      ok(onError)
      return rest
    })
    await test('mask-nl.json', fr)
  },
}

export default T