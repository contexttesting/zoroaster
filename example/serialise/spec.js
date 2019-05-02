import Zoroaster from '../../src'
import Example from './Example'

export const withSerialisation = {
  context: class extends Zoroaster {
    /** @param {Example} example **/
    static serialise(example) {
      // prevent comparison of a date object and JSON string
      example.created = example.created.toGMTString()
      // prevent omitting of undefined in the JSON snapshot
      Object.keys(example).forEach((key) => {
        const val = example[key]
        example[key] = val === undefined ? 'undefined' : val
      })
      return { ...example }
    }
  },
  async 'serialises dates'() {
    const instance = new Example('test', true)
    return instance
  },
  async 'records missing properties'() {
    const instance = new Example()
    return instance
  },
}

export const withoutSerialisation = {
  async 'serialises dates'() {
    const instance = new Example('test', true)
    return instance
  },
  async 'records missing properties'() {
    const instance = new Example()
    return instance
  },
}