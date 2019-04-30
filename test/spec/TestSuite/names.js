import deepEqual from '@zoroaster/deep-equal'
// import throws from 'assert-throws'
import TestSuite from '../../../src/lib/TestSuite'
import Context from '../../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'returns a list of names'({ TEST_SUITE_NAME }) {
    const n = 'test A'
    const n1 = 'test B'
    const n2 = 'test C'
    const n3 = 'test D'
    const ts = new TestSuite(TEST_SUITE_NAME, {
      [n]() {},
      [n1]() {},
      testSuiteB: {
        [n2]() {},
        [n3]() {},
      },
    })
    const res = ts.names
    deepEqual(res, [n, n1, 'testSuiteB', n2, n3])
  },
}

export default T
