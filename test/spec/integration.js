import { fork } from 'spawncommand'
import SnapshotContext from 'snapshot-context'
import Context from '../context'

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
const T = {
  context:[
    Context,
    SnapshotContext,
  ],
  async 'produces correct output'(
    { TEST_SUITE_PATH, SNAPSHOT_DIR, BIN, getSnapshot }, { test, setDir },
  ) {
    setDir(SNAPSHOT_DIR)
    const { promise } = fork(BIN, [TEST_SUITE_PATH, '-a', '-t', 250], {
      stdio: 'pipe',
    })
    const { stdout } = await promise
    const s = getSnapshot(stdout)
    await test('integration-stdout.txt', s)
  },
}

export default T
