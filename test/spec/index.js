import assert from 'assert'
import { resolve } from 'path'
import { ChildProcess } from 'child_process'
import zoroaster from '../..'

const { equal } = assert

const TEST_SUITE_PATH = resolve(__dirname, '../fixtures/test_suite.js')

const t = {
  'exports a function'() {
    equal(typeof zoroaster, 'function')
  },
  async 'returns a child process'() {
    const proc = zoroaster()
    assert(proc instanceof ChildProcess)
    await proc.promise
  },
  async 'returns a promise'() {
    const proc = zoroaster()
    assert(proc.promise instanceof Promise)
    await proc.promise
  },
  async 'reports on 0 tests executed when empty args'() {
    const proc = zoroaster()
    assert(proc.promise instanceof Promise)
    const res = await proc.promise
    equal('🦅  Executed 0 tests.', res.stdout.trim())
  },
  async 'should report on test suite executed'() {
    const proc = zoroaster([TEST_SUITE_PATH])
    assert(proc.promise instanceof Promise)
    const { stderr, code, stdout } = await proc.promise
    equal(stderr, '')
    equal(code, 2) // test fixtures not passing with 2 errors
    assert(stdout.length > 100)
  },
}

export default t
