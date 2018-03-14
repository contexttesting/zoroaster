const assert = require('assert')
const Test = require('../../src/test')

const name = 'The higher we soar the smaller we appear to those who cannot fly.'
const fn = () => {}
const errorMessage = 'When you are in doubt abstain.'

const Test_test_suite = {
  instance: {
    'sets the name'() {
      const test = new Test(name, fn)
      assert(test.name === name)
    },
    'sets the function'() {
      const test = new Test(name, fn)
      assert(test.fn === fn)
    },
    'sets variables to null'() {
      const test = new Test(name, fn)
      assert(test.started === null)
      assert(test.finished === null)
      assert(test.error === null)
      assert(test.result === null)
    },
    timeout: {
      'has a default timeout'() {
        const test = new Test(name, fn)
        assert(test.timeout === 2000)
      },
      'sets a timeout'() {
        const timeout = 1000
        const test = new Test(name, fn, timeout)
        assert(test.timeout === timeout)
      },
    },
    'has the run method'() {
      const test = new Test(name, fn)
      assert(typeof test.run === 'function')
    },
  },
  runTest: {
    async 'fails test after specified timeout'() {
      const timeout = 100
      const fn = async () => {
        await new Promise(r => setTimeout(r, timeout + 100))
      }
      const test = new Test(name, fn, timeout)
      await test.run()
      assert(test.hasErrors())
      const expectedMsg = `Test has timed out after ${timeout}ms`
      assert(test.error.message === expectedMsg)
    },
    async 'runs a test'() {
      const test = new Test(name, fn)
      const res = test.run()

      assert(res instanceof Promise)
      assert(test.started !== null)

      await res
      assert(test.error === null)
      assert(test.result === undefined)
      assert(test.finished !== null)
    },
    async 'saves result of a test'() {
      const result = 'test_string_result'
      const test = new Test(name, () => result)
      const res = test.run()

      await res
      assert(test.result === result)
    },
    async 'should run a test with an error'() {
      const test = new Test(name, () => {
        throw new Error(errorMessage)
      })
      const res = test.run()

      await res
      assert(test.result === null)
      assert(test.error !== null)
      assert(test.error.message === errorMessage)
      assert(test.result === null)
    },
  },
  hasErrors: {
    async 'reports as having an error'() {
      const test = new Test(name, () => {
        throw new Error(errorMessage)
      })
      await test.run()
      assert(test.hasErrors())
    },
    async 'reports as not having an error'() {
      const test = new Test(name, () => {})
      await test.run()
      assert(!test.hasErrors())
    },
  },
}

module.exports = Test_test_suite
