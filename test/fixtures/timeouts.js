import makeTestSuite from '@zoroaster/mask'

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
  getResults() {
    return this.input.replace('input', 'output').replace('to', 'of')
  },
  context: Context,
})