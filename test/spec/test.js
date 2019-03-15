import { equal, ok, notEqual } from 'assert'
import Test from '../../src/lib/Test'

class C {
  get name() {
    return 'The higher we soar the smaller we appear to those who cannot fly.'
  }
  fn() {}
  get errorMessage() {
    return 'When you are in doubt abstain.'
  }
}

/** @type {Object.<string, (c: C)>} */
const T = {
  context: C,
  'sets the name'({ name, fn }) {
    const test = new Test(name, fn)
    equal(test.name, name)
  },
  'sets the function'({ name, fn }) {
    const test = new Test(name, fn)
    equal(test.fn, fn)
  },
  'sets variables to null'({ name, fn }) {
    const test = new Test(name, fn)
    equal(test.started, null)
    equal(test.finished, null)
    equal(test.error, null)
    equal(test.result, null)
  },
  timeout: {
    'has a default timeout'({ name, fn }) {
      const test = new Test(name, fn)
      equal(test.timeout, 2000)
    },
    'sets a timeout'({ name, fn }) {
      const timeout = 1000
      const test = new Test(name, fn, timeout)
      equal(test.timeout, timeout)
    },
  },
  'has the run method'({ name, fn }) {
    const test = new Test(name, fn)
    equal(typeof test.run, 'function')
  },
}

export default T //{ '!T': T }

/** @type {Object.<string, (c: C)>} */
export const runTest = {
  context: C,
  async 'fails test after specified timeout'({ name }) {
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
  async 'runs a test'({ name, fn }) {
    const test = new Test(name, fn)
    const res = test.run()

    ok(res instanceof Promise)

    await res
    ok(test.error === null)
    ok(test.result === undefined)
    notEqual(test.started, null)
    notEqual(test.finished, null)
  },
  // async 'saves result of a test'({ name }) {
  //   const result = 'test_string_result'
  //   const test = new Test(name, () => result)
  //   const res = test.run()

  //   await res
  //   equal(test.result, result)
  // },
  async 'runs a test with an error'({ name, errorMessage }) {
    const test = new Test(name, () => {
      throw new Error(errorMessage)
    })
    await test.run()

    ok(test.result === null)
    notEqual(test.error, null)
    equal(test.error.message, errorMessage)
  },
}

export const hasErrors = {
  context: C,
  async 'reports as having an error'({ name, errorMessage }) {
    const test = new Test(name, () => {
      throw new Error(errorMessage)
    })
    await test.run()
    ok(test.hasErrors())
  },
  async 'reports as not having an error'({ name, fn }) {
    const test = new Test(name, fn)
    await test.run()
    ok(!test.hasErrors())
  },
}
