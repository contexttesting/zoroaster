import assert, { equal } from 'assert'
import { equal as testEqual, deepEqual, assert as testAssert } from '../../../assert'

const t = {
  'throws if not equal'() {
    try {
      testEqual('a', 'b')
      throw new Error('should have thrown')
    } catch (error) {
      equal(error.operator, '==')
      equal(error.actual, 'a')
      equal(error.expected, 'b')
    }
  },
  'throws if not deep equal'() {
    try {
      deepEqual({ test: 'string' }, { test: 'string-2' })
      throw new Error('should have thrown')
    } catch (error) {
      const message = error.message
      assert(/\+ {2}test: "string"/.test(message))
      assert(/- {2}test: "string-2"/.test(message))
    }
  },
  'throws if not true'() {
    try {
      testAssert(false)
      throw new Error('should have thrown')
    } catch (error) {
      const message = error.message
      equal(message, 'false == true')
    }
  },
}

export default t
