const { assert, equal } = require('./assert')

const software = (type) => {
  switch (type) {
    case 'boolean':
      return true
    case 'string':
      return 'string'
    default:
      return null
  }
}

const asyncSoftware = async (type) => {
  await new Promise(r => setTimeout(r, 50))
  return software(type)
}

module.exports = {
  'should run a test'() {
    const res = software('boolean')
    assert(res)
  },
  async 'should run an async test'() {
    const res = await asyncSoftware('string')
    equal(res, 'string')
  },
}
