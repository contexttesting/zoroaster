import { join } from 'path'
import SnapshotContext from 'snapshot-context'
import exists from '@wrote/exists'
import { c } from 'erte'

const handleSnapshot = async (result, name, path, snapshotDir, snapshotRoot) => {
  const nn = name.replace(/^!/, '')
  const n = nn.replace(/ /g, '-')
  const ext = typeof result == 'string' ? 'txt' : 'json'
  const snapshotFilename = `${n}.${ext}`
  let pp = join(...path)
  const root = snapshotRoot.find(r => {
    const rr = join(...r.split('/'))
    return pp.startsWith(rr)
  })
  if (root) pp = pp.slice(root.length)
  let p = join(snapshotDir, pp)

  if (result) {
    const sc = new SnapshotContext()
    sc.setDir(p)
    const otherSnapshot = snapshotFilename
      .replace(/(json|txt)$/, (m) => {
        if (m == 'txt') return 'json'
        return 'txt'
      })
    const e = await exists(join(p, otherSnapshot))
    if (e)
      throw new Error(`Snapshot of another type exists: ${otherSnapshot}`)
    await sc.test(snapshotFilename, result, c(nn, 'yellow'))
  } else {
    let snapshotPath = join(p, snapshotFilename)
    let e = await exists(snapshotPath)
    if (!e) {
      snapshotPath = snapshotPath.replace(/json$/, 'txt')
      e = await exists(snapshotPath)
    }
    if (e) {
      throw new Error(`Snapshot ${snapshotPath} exists, but the test did not return anything.`)
    }
  }
}

export default handleSnapshot