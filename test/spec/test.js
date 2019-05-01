import { equal, ok, notEqual } from 'assert'
import Test from '../../src/lib/Test'
import Context from '../context'

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
}

export default T //{ '!T': T }

/** @type {Object.<string, (c: C, co: Context)>} */
export const runTest = {
  context: [C, Context],
  async 'fails test after specified timeout'({ name }, { runATest }) {
    const timeout = 100
    const t = async () => {
      await new Promise(r => setTimeout(r, timeout + 100))
    }
    const test = new Test(name, t, timeout)
    const nots = await runATest(test)
    const [, { error }] = nots
    const expectedMsg = `Test has timed out after ${timeout}ms`
    equal(error.message, expectedMsg)
  },
  async 'runs a test'({ name, fn }, { runATest }) {
    const test = new Test(name, fn)
    const res = await runATest(test, true)
    ok(res.error === null)
    ok(res.result === undefined)
    notEqual(res.started, null)
    notEqual(res.finished, null)
  },
  // async '!saves result of a test'({ name }, { runATest }) {
  //   const result = 'test_string_result'
  //   const test = new Test(name, () => result)
  //   const res = await runATest(test, true)
  //   equal(res.result, result)
  // },
  async 'runs a test with an error'({ name, errorMessage }, { runATest }) {
    const test = new Test(name, () => {
      throw new Error(errorMessage)
    })
    const res = await runATest(test, true)

    ok(res.result === null)
    notEqual(res.error, null)
    equal(res.error.message, errorMessage)
  },
}

export const hasErrors = {
  context: [C, Context],
  async 'reports as having an error'({ name, errorMessage }, { runATest }) {
    const test = new Test(name, () => {
      throw new Error(errorMessage)
    })
    const nots = await runATest(test)
    ok(nots.some(({ error }) => error))
  },
  async 'reports as not having an error'({ name, fn }, { runATest }) {
    const test = new Test(name, fn)
    const nots = await runATest(test)
    ok(!nots.some(({ error }) => error))
  },
}
