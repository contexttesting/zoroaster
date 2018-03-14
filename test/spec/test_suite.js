const assert = require('assert')
const { resolve } = require('path')
const TestSuite = require('../../src/test_suite')
const test_suite = require('../fixtures/test_suite')

const testSuiteName = 'Zoroaster Test Suite'
const errorMessage = 'When you are in doubt abstain.'

const TestSuite_test_suite = {
  constructor: {
    'throws an error if no name is given'() {
      try {
        new TestSuite()
        throw new Error('No name error should have been thrown.')
      } catch (err) {
        assert(err.message === 'Test suite name must be given.')
      }
    },
    'throws an error if neither object nor path given'() {
      try {
        new TestSuite(testSuiteName)
        throw new Error('No path or object error should have been thrown.')
      } catch (err) {
        assert(err.message === 'You must provide either a path to a module, or tests in an object.')
      }
    },
    'initialises test suite name'() {
      const testSuite = new TestSuite(testSuiteName, {})
      assert(testSuite.name === testSuiteName)
    },
    'creates a test suite from an object'() {
      const testSuite = new TestSuite(testSuiteName, test_suite)
      assert(testSuite.rawTests === test_suite)
    },
    'creates a test suite from a file'() {
      const test_suite_path = resolve(__dirname, '../fixtures/test_suite')
      const testSuite = new TestSuite(testSuiteName, test_suite_path)
      assert(testSuite.path === test_suite_path)
      testSuite.require()
      assert(testSuite.rawTests === test_suite)
    },
  },
  'should throw an error when test suite could not be required': () => {
    const tsPath = 'noop-path'
    const testSuite = new TestSuite(testSuiteName, tsPath)
    assert(testSuite.path === tsPath)
    try {
      testSuite.require()
      throw new Error('Cannot find module error should have been thrown')
    } catch (err) {
      assert(err.message === 'Cannot find module \'noop-path\'')
    }
  },
  async 'runs a test suite'() {
    const testSuite = new TestSuite(testSuiteName, {
      test() {},
      async test2() { throw new Error('error') },
      async test3() {},
    })
    await testSuite.run()
    testSuite.tests.forEach((test) => {
      assert(test.started)
      assert(test.finished)
    })
  },
  async 'runs a test suite recursively'() {
    const testSuite = new TestSuite(testSuiteName, {
      test_suite: {
        test() {},
      },
    })
    await testSuite.run()
    const test = testSuite.tests[0].tests[0]
    assert(test.started)
    assert(test.finished)
  },
  'creates test suites recursively'() {
    const testSuite = new TestSuite(testSuiteName, {
      test_suite_level_A1: {
        test_suite_level_A1B1: {
          testA1B1() {},
        },
        test_suite_level_A1B2: {
          testA1B2() {},
        },
      },
      test_suite_level_A2: {
        test_suite_level_A2B1: {
          testA2B1() {},
        },
        test_suite_level_A2B2: {
          testA2B2() {},
        },
      },
    })
    assert(testSuite.tests[0].name === 'test_suite_level_A1')
    assert(testSuite.tests[0].tests[0].name === 'test_suite_level_A1B1')
    assert(testSuite.tests[0].tests[0].tests[0].name === 'testA1B1')
    assert(testSuite.tests[0].tests[1].name === 'test_suite_level_A1B2')
    assert(testSuite.tests[0].tests[1].tests[0].name === 'testA1B2')

    assert(testSuite.tests[1].name === 'test_suite_level_A2')
    assert(testSuite.tests[1].tests[0].name === 'test_suite_level_A2B1')
    assert(testSuite.tests[1].tests[0].tests[0].name === 'testA2B1')
    assert(testSuite.tests[1].tests[1].name === 'test_suite_level_A2B2')
    assert(testSuite.tests[1].tests[1].tests[0].name === 'testA2B2')
  },
  'creates a recursive test suite using string'() {
    const test_suite_path = resolve(__dirname, '../fixtures/test_suite')
    const testSuite = new TestSuite(testSuiteName, {
      fixtures_test_suite: test_suite_path,
    })
    assert(testSuite.tests[0].name === 'fixtures_test_suite')
    assert(testSuite.tests[0].path === test_suite_path)
    assert(testSuite.tests[0].parent === testSuite)
  },
  async 'has an error when a test fails'() {
    const testSuite = new TestSuite(testSuiteName, {
      test_does_not_have_error() {},
      test_has_error() { throw new Error(errorMessage) },
    })
    await testSuite.run()
    assert(testSuite.hasErrors)
  },
  async 'has an error when a test suite fails'() {
    const testSuite = new TestSuite(testSuiteName, {
      test_suite_does_not_have_error: {
        test_does_not_have_error() {},
      },
      test_suite_has_error: {
        test_has_error() { throw new Error(errorMessage) },
      },
    })
    await testSuite.run()
    assert(testSuite.hasErrors)
  },
  'creates a test with a default timeout'() {
    const testSuite = new TestSuite(testSuiteName, {
      test() {},
    })
    assert(testSuite._tests[0].timeout === 2000)
  },
}

module.exports = TestSuite_test_suite
