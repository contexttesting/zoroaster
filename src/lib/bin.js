import { lstat, readdir } from 'fs'
import { resolve, join, relative } from 'path'
import makePromise from 'makepromise'
import cleanStack from '@artdeco/clean-stack'
import { c, b } from 'erte'
import TestSuite from './TestSuite'
import { replaceFilename } from '.'

/**
 * Remove modules cached by require.
 */
export function clearRequireCache() {
  Object.keys(require.cache).forEach((key) => {
    const p = relative('', key)
    if (!p.startsWith('node_modules') &&
        !p.endsWith('_ZoroasterServiceContext.js')) {
      delete require.cache[key]
    }
  })
}

/**
 * Create a root test suite.
 * @param {string[]} paths
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
 * Recursively load a file/directory tests as a tree into memory.
 * @param {string} path Path to a test suite
 */
async function requireTests(path) {
  try {
    const res = await makePromise(lstat, path)
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
    // eslint-disable-next-line
    console.error(c(`Could not require`, 'red'), b(c(path, 'white'), 'red'))
    // eslint-disable-next-line
    console.error(cleanStack(err.stack))
  }
}