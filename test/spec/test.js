import { equal, ok, notEqual } from 'assert'
import Test from '../../src/lib/Test'

const name = 'The higher we soar the smaller we appear to those who cannot fly.'
const fn = () => {}
const errorMessage = 'When you are in doubt abstain.'

export const instance = {
  'sets the name'() {
    const test = new Test(name, fn)
    equal(test.name, name)
  },
  'sets the function'() {
    const test = new Test(name, fn)
    equal(test.fn, fn)
  },
  'sets variables to null'() {
    const test = new Test(name, fn)
    equal(test.started, null)
    equal(test.finished, null)
    equal(test.error, null)
    equal(test.result, null)
  },
  timeout: {
    'has a default timeout'() {
      const test = new Test(name, fn)
      equal(test.timeout, 2000)
    },
    'sets a timeout'() {
      const timeout = 1000
      const test = new Test(name, fn, timeout)
      equal(test.timeout, timeout)
    },
  },
  'has the run method'() {
    const test = new Test(name, fn)
    equal(typeof test.run, 'function')
  },
}

export const runTest = {
  async 'fails test after specified timeout'() {
    const timeout = 100
    const t = async () => {
      await new Promise(r => setTimeout(r, timeout + 100))
    }
    const test = new Test(name, t, timeout)
    await test.run()
    ok(test.hasErrors())
    const expectedMsg = `Test has timed out after ${timeout}ms`
    equal(test.error.message, expectedMsg)
  },
  async 'runs a test'() {
    const test = new Test(name, fn)
    const res = test.run()

    ok(res instanceof Promise)
    notEqual(test.started, null)

    await res
    equal(test.error, null)
    equal(test.result, undefined)
    notEqual(test.finished, null)
  },
  async 'saves result of a test'() {
    const result = 'test_string_result'
    const test = new Test(name, () => result)
    const res = test.run()

    await res
    equal(test.result, result)
  },
  async 'should run a test with an error'() {
    const test = new Test(name, () => {
      throw new Error(errorMessage)
    })
    const res = test.run()

    await res
    equal(test.result, null)
    notEqual(test.error, null)
    equal(test.error.message, errorMessage)
    equal(test.result, null)
  },
}

export const hasErrors = {
  async 'reports as having an error'() {
    const test = new Test(name, () => {
      throw new Error(errorMessage)
    })
    await test.run()
    ok(test.hasErrors())
  },
  async 'reports as not having an error'() {
    const test = new Test(name, fn)
    await test.run()
    ok(!test.hasErrors())
  },
}
