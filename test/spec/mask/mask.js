import { deepEqual } from 'assert-diff'
import SnapshotContext from 'snapshot-context'
import { ok, equal } from 'assert'
import throws from 'assert-throws'
import Context from '../../context'
import getTests from '../../../src/lib/mask'

/** @type {Object.<string, (c: Context, sc: SnapshotContext)>} */
const T = {
  context: [Context, SnapshotContext],
  async 'can make a mask'({ MASK_PATH }, { test }) {
    const res = getTests({ path: MASK_PATH })
    const fr = res.map(({ onError, ...rest }) => {
      ok(onError)
      return rest
    })
    await test('mask.json', fr)
  },
  async 'can make a mask with a separator'(
    { MASK_SPLIT_PATH }, { test },
  ) {
    const res = getTests({ path: MASK_SPLIT_PATH, splitRe: /^\/\/\/ /mg })
    const fr = res.map(({ onError, ...rest }) => {
      ok(onError)
      return rest
    })
    await test('mask-nl.json', fr)
  },
  async 'prints the error lines for custom separators'(
    { MASK_SPLIT_PATH }
  ) {
    const [res] = getTests({ path: MASK_SPLIT_PATH, splitRe: /^\/\/\/ /mg })
    await throws({
      fn: res.onError,
      args: new Error('hola'),
      stack: `Error: hola
    at a mask with a new line (${MASK_SPLIT_PATH}:1:1)`,
    })
  },
  async 'can make a mask with a new line'(
    { MASK_NL_PATH }, { test },
  ) {
    const res = getTests({ path: MASK_NL_PATH })
    const fr = res.map(({ onError, ...rest }) => {
      ok(onError)
      return rest
    })
    await test('mask-nl.json', fr)
  },
  async 'can make a mask with empty expected'({ MASK_EMPTY_PATH }) {
    const res = getTests({ path: MASK_EMPTY_PATH })
    equal(res.length, 1)
    const [test] = res
    ok(test.onError)
    delete test.onError
    deepEqual(test, {
      name: 'an empty expected',
      input: '',
      expected: '',
    })
  },
  async 'can make a mask with blank expected'({ MASK_BLANK_PATH }) {
    const res = getTests({ path: MASK_BLANK_PATH })
    equal(res.length, 1)
    const [test] = res
    ok(test.onError)
    delete test.onError
    deepEqual(test, {
      name: 'a blank expected',
      input: '',
      expected: '\n',
    })
  },
}

export default T