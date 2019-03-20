const { join } = require('path');
let SnapshotContext = require('snapshot-context'); if (SnapshotContext && SnapshotContext.__esModule) SnapshotContext = SnapshotContext.default;
let exists = require('@wrote/exists'); if (exists && exists.__esModule) exists = exists.default;
const { c } = require('erte');

const handleSnapshot = async (result, name, path, snapshotDir, snapshotRoot, interactive) => {
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
    const op = join(p, otherSnapshot)
    const e = await exists(op)
    if (e)
      blankError(`Snapshot of another type exists: ${op}`)

    try {
      await sc.test(snapshotFilename, result, c(nn, 'yellow'), interactive)
    } catch (err) {
      blankError(err)
    }
  } else {
    let snapshotPath = join(p, snapshotFilename)
    let e = await exists(snapshotPath)
    if (!e) {
      snapshotPath = snapshotPath.replace(/json$/, 'txt')
      e = await exists(snapshotPath)
    }
    if (e) {
      blankError(`Snapshot ${snapshotPath} exists, but the test did not return anything.`)
    }
  }
}

const blankError = (message) => {
  const err = new Error(message)
  err.stack = err.message
  throw err
}

module.exports=handleSnapshot