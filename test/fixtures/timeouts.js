// import { ok } from '../../src/assert'
// import TestSuite from '../../src/lib/TestSuite'
import makeTestSuite from '../../src/lib/make-test-suite'

class Context {
  async _init() {
    await new Promise(r => {
      this._starting = true
      setTimeout(() => {
        r()
      }, 1500) // has to finish after the test bro
    })
  }
  getStarting() {
    return this._starting
  }
  async _destroy() {
    this.destroyed = true
  }
  start() {
    this.started = 'ok'
  }
  getStarted() {
    return this.started
  }
}

export default makeTestSuite('test/fixture/test-suite', {
  getResults(input) {
    return input.replace('input', 'output').replace('to', 'of')
  },
  context: Context,
})

// delete tests._rawTests
// export default tests
// console.log(tests)
// export default tests.reduce((acc, t) => {
//   const {
//     timeout, name, _fn, context,
//   } = t
//   acc[name] = t
//   return acc
// }, {})
// export { tests }

// { start, getStarted, getStarting }
// const s = getStarting()
// ok(s)
// start()
// const t = getStarted()
// console.log(t)