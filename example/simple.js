// Zoroaster test suite
import { ok, equal } from 'assert'
import { software, asyncSoftware } from './src'

class Context {
  async _init() {
    await new Promise(r => setTimeout(r, 100))
    this._data = 'hello world;'
  }
  /** Returns the testing data */
  get data() {
    return this._data
  }
}

/**
 * @type {Object.<string, (c:Context)>}
 */
const TestSuite = {
  context: Context,
  'runs a test'() {
    const res = software('boolean')
    ok(res)
  },
  async 'runs an async test'() {
    const res = await asyncSoftware('string')
    equal(res, 'string')
  },
  async 'supports snapshots'({ data }) {
    const res = await asyncSoftware('string')
    return `${res} :: ${data}`
  },
}

export default TestSuite