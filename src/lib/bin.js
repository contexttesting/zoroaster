import { lstat, readdir } from 'fs'
import { resolve, join, relative } from 'path'
import makePromise from 'makepromise'
import { c, b } from 'erte'
import TestSuite from './TestSuite'
import { replaceFilename } from './'

/**
 * Remove modules cached by require.
 */
export function clearRequireCache() {
  Object.keys(/** @type {!Object} */ (require.cache)).forEach((key) => {
    const p = relative('', key)
    if (!p.startsWith('node_modules')) {
      delete require.cache[key]
    }
  })
}

/**
 * Create a root test suite.
 * @param {!Array<string>} paths
 * @param {number} timeout
 */
export const buildRootTestSuite = async (paths, timeout) => {
  const tree = await paths.reduce(async (acc, path) => {
    const accRes = await acc
    const r = await requireTests(path)
    if (!r) return accRes
    return {
      ...accRes,
      [path]: r,
    }
  }, {})
  const ts = new TestSuite(
    'Zoroaster Root Test Suite', tree, null, undefined, timeout,
  )
  return ts
}

/**
 * Recursively construct Test Suites tree from a directory path.
 * @param {string} dir Path to the directory.
 * @todo filter out non-js files
 */
export async function buildDirectory(dir) {
  const content = /** @type {!Array<string>} */
    (await makePromise(readdir, dir))
  const res = content.reduce(async (acc, node) => {
    const accRes = await acc
    const path = join(dir, node)
    const stat = /** @type {fs.Stats} */ (await makePromise(lstat, path))
    let r
    let name
    if (stat.isFile()) {
      const p = resolve(path)
      r = require(p) // await import(p)
      name = replaceFilename(node)
    } else if (stat.isDirectory()) {
      r = await buildDirectory(path)
      name = node
    }
    if (accRes[name]) {
      // to avoid that, could keep the filenames here,
      // but don't print them in the reporter
      console.warn('Merging %s with %s in %s', name, node, dir)
      accRes[name] = safeMerge(accRes[name], r)
      return accRes
    } else {
      return {
        ...accRes,
        [name]: r,
      }
    }
  }, {})
  return res
}

const safeMerge = (one, two) => {
  Object.keys(two).forEach((key) => {
    if (one[key]) {
      throw new Error(`Duplicate key ${key}`)
    }
  })
  const res = {
    ...one,
    ...two,
  }
  return res
}

/**
 * Recursively load a file/directory tests as a tree into memory.
 * @param {string} path Path to a test suite
 */
async function requireTests(path) {
  try {
    const res = /** @type {fs.Stats} */ (await makePromise(lstat, path))
    if (res.isFile()) {
      const p = resolve(path)
      const tests = require(p)
      return tests
    } else if (res.isDirectory()) {
      const dir = await buildDirectory(path)
      return dir
    }
  } catch (err) {
    // file or directory does not exist
    const m = c('Could not require', 'red') + b(c(path, 'white'), 'red')
    err.message += `\n${m}`
    throw err
  }
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('fs').Stats} fs.Stats
 */