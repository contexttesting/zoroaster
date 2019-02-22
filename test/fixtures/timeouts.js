import makeTestSuite from '../../src/lib/make-test-suite'

class Context {
  async _init() {
    await new Promise(r => {
      this._starting = true
      setTimeout(() => {
        r()
      }, 250)
    })
  }
}

export default makeTestSuite('test/fixture/test-suite', {
  getResults(input) {
    return input.replace('input', 'output').replace('to', 'of')
  },
  context: Context,
})