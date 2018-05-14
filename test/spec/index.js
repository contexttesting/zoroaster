import { ok, equal } from 'assert'
import { ChildProcess } from 'child_process'
import zoroaster from '../../build'
import context, { Context } from '../context' // eslint-disable-line no-unused-vars

/** @type {Object.<string, (ctx: Context)>} */
const t = {
  context,
  'exports a function'() {
    equal(typeof zoroaster, 'function')
  },
  async 'returns a child process'() {
    const proc = zoroaster()
    ok(proc instanceof ChildProcess)
    await proc.promise
  },
  async 'returns a promise'() {
    const proc = zoroaster()
    ok(proc.promise instanceof Promise)
    await proc.promise
  },
  async 'reports on 0 tests executed when empty args'() {
    const proc = zoroaster()
    ok(proc.promise instanceof Promise)
    const res = await proc.promise
    equal('🦅  Executed 0 tests.', res.stdout.trim())
  },
  async 'reports on test suite executed'({ TEST_SUITE_PATH }) {
    const proc = zoroaster([TEST_SUITE_PATH, '--babel'])
    ok(proc.promise instanceof Promise)
    const { stderr, code, stdout } = await proc.promise
    equal(stderr, '')
    equal(code, 4) // test fixtures not passing with 4 errors
    ok(stdout.length > 100)
  },
}

export default t
