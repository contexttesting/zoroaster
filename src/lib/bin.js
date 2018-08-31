import { lstat, readdir } from 'fs'
import { resolve, join } from 'path'
import makePromise from 'makepromise'
import TestSuite from './TestSuite'

/**
 * Remove modules cached by require.
 */
export function clearRequireCache() {
  Object.keys(require.cache).forEach((key) => {
    delete require.cache[key]
  })
}

/**
 * Create a root test suite.
 * @param {string[]} paths
 */
export const buildTestSuites = async (paths) => {
  const testSuites = await paths.reduce(async (acc, path) => {
    const accRes = await acc
    const r = await requireTestSuite(path)
    if (!r) return accRes
    return {
      ...accRes,
      [path]: r,
    }
  }, {})
  const ts = new TestSuite('Zoroaster Root Test Suite', testSuites)
  return ts
}

const replaceFilename = (filename) => {
  return filename.replace(/\.js$/, '')
}

/**
 * Recursively construct Test Suites tree from a directory path.
 * @param {string} dir Path to the directory.
 */
async function buildDirectory(dir) {
  const content = await makePromise(readdir, dir)
  const res = content.reduce(async (acc, node) => {
    const accRes = await acc
    const path = join(dir, node)
    const stat = await makePromise(lstat, path)
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
    return {
      ...accRes,
      [name]: r,
    }
  }, {})
  return res
}

/**
 * Recursively load a file/directory test suite into memory.
 * @param {string} path Path to a test suite
 */
async function requireTestSuite(path) {
  try {
    const res = await makePromise(lstat, path)
    if (res.isFile()) {
      const p = resolve(path)
      const tests = require(p)
      const ts = new TestSuite(path, tests)
      return ts
    } else if (res.isDirectory()) {
      const dir = await buildDirectory(path)
      const ts = new TestSuite(path, dir)
      return ts
    }
  } catch (err) {
    // file or directory does not exist
    // eslint-disable-next-line
    console.error(err)
  }
}