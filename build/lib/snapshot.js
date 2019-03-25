const { join } = require('path');
let SnapshotContext = require('snapshot-context'); if (SnapshotContext && SnapshotContext.__esModule) SnapshotContext = SnapshotContext.default;
let exists = require('@wrote/exists'); if (exists && exists.__esModule) exists = exists.default;
let rm = require('@wrote/rm'); if (rm && rm.__esModule) rm = rm.default;
const { c } = require('erte');
const { confirm } = require('reloquent');
const { inspect } = require('util');
let Stream = require('stream'); if (Stream && Stream.__esModule) Stream = Stream.default;
const { collect } = require('catchment');

const handleSnapshot = async (result, name, path, snapshotDir, snapshotRoot, interactive, extension = 'txt') => {
  const nn = name.replace(/^!/, '')
  const n = nn.replace(/ /g, '-')
  if (result instanceof Stream) {
    result = await collect(result)
  }
  const isString = typeof result == 'string'
  const ext = isString ? extension : 'json'
  const snapshotFilename = `${n}.${ext}`
  let pp = join(...path)
  const root = snapshotRoot.find(r => {
    const rr = join(...r.split('/'))
    return pp.startsWith(rr)
  })
  if (root) pp = pp.slice(root.length)
  const p = join(snapshotDir, pp)
  let snapshotPath = join(p, snapshotFilename)

  if (result) {
    const sc = new SnapshotContext()
    sc.setDir(p)
    const otherSnapshot = `${n}.${isString ? 'json' : extension}`
    const op = join(p, otherSnapshot)
    const e = await exists(op)
    if (e) {
      const m = `Snapshot of another type exists: ${c(op, 'red')}`
      if (!interactive) {
        throwError(m)
      }
      console.log('%s.\nNew data:', m)
      console.log(isString ? result : inspect(result, { colors: true }))
      const upd = await confirm(`Update snapshot ${c(op, 'yellow')} to a new type?`)
      if (!upd)
        throwError(m)
      await sc.save(snapshotFilename, result)
      await rm(op)
      return
    }

    try {
      await sc.test(snapshotFilename, result, c(nn, 'yellow'), interactive)
    } catch (err) {
      if (err.message == 'The string didn\'t match the snapshot.') {
        err.message = `The string didn't match the snapshot ${c(snapshotPath, 'yellow')}`
      }
      throwError(err)
    }
  } else {
    let e = await exists(snapshotPath)
    if (!e) {
      snapshotPath = snapshotPath.replace(/json$/, extension)
      e = await exists(snapshotPath)
    }
    if (e) {
      throwError(`Snapshot ${snapshotPath} exists, but the test did not return anything.`)
    }
  }
}

const throwError = (message) => {
  const err = new Error(message)
  err.stack = err.message
  throw err
}

module.exports=handleSnapshot