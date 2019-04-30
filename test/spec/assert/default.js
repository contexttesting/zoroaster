import ok, { equal } from 'assert'
import { equal as testEqual, deepEqual as testDeepEqual, assert as testAssert } from '../../../src'

const T = {
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
      testDeepEqual({ test: 'string' }, { test: 'string-2' })
      throw new Error('should have thrown')
    } catch (error) {
      const message = error.message
      ok(/\+ string/.test(message))
      ok(/- string-2/.test(message))
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

export default T
