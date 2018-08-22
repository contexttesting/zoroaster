import { ok, equal } from 'assert'
import { ChildProcess } from 'child_process'
import zoroaster from '../../src'
import Context from '../context'

/** @type {Object.<string, (c: Context)>} */
const t = {
  context: Context,
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
    const { promise } = zoroaster([TEST_SUITE_PATH, '--alamode'])
    ok(promise instanceof Promise)
    const { stderr, code, stdout } = await promise
    equal(stderr, '')
    equal(code, 4) // test fixtures not passing with 4 errors
    ok(stdout.length > 100)
  },
}

export default t
