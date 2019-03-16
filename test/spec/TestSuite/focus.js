import { deepEqual } from 'assert'
import TestSuite from '../../../src/lib/TestSuite'
import Context from '../../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'runs focused tests across test suites'({ TEST_SUITE_NAME, runTestSuite }) {
    const run = []
    const ts = new TestSuite(TEST_SUITE_NAME, {
      testSuiteA: {
        'testAA'() {
          run.push('testAA')
        },
        '!testAB'() {
          run.push('!testAB')
        },
        'testAC'() {
          run.push('testAC')
        },
      },
      testSuiteB: {
        'testBA'() {
          run.push('testBA')
        },
        '!testBB'() {
          run.push('!testBB')
        },
        'testBC'() {
          run.push('testBC')
        },
      },
    })
    await runTestSuite(ts, true, ts.hasFocused)
    deepEqual(run, ['!testAB', '!testBB'])
  },
  async 'runs all tests inside focused test suite'({ TEST_SUITE_NAME, runTestSuite }) {
    const run = []
    const ts = new TestSuite(TEST_SUITE_NAME, {
      '!testSuiteA': {
        'testAA'() {
          run.push('testAA')
        },
        'testAB'() {
          run.push('testAB')
        },
        'testAC'() {
          run.push('testAC')
        },
      },
      testSuiteB: {
        'testBA'() {
          run.push('testBA')
        },
        'testBB'() {
          run.push('testBB')
        },
        'testBC'() {
          run.push('testBC')
        },
      },
    })
    await runTestSuite(ts, true, ts.hasFocused)
    deepEqual(run, ['testAA', 'testAB', 'testAC'])
  },
  async 'runs all tests inside a focused test suite and other tests'({ TEST_SUITE_NAME, runTestSuite }) {
    const run = []
    const ts = new TestSuite(TEST_SUITE_NAME, {
      '!testSuiteA': {
        'testAA'() {
          run.push('testAA')
        },
        'testAB'() {
          run.push('testAB')
        },
        'testAC'() {
          run.push('testAC')
        },
      },
      testSuiteB: {
        'testBA'() {
          run.push('testBA')
        },
        '!testBB'() {
          run.push('!testBB')
        },
        'testBC'() {
          run.push('testBC')
        },
      },
    })
    await runTestSuite(ts, true, ts.hasFocused)
    deepEqual(run, ['testAA', 'testAB', 'testAC', '!testBB'])
  },
}

export default T
