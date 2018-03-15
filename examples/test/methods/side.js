const { throws, assert } = require('../../../assert')
const Zoroaster = require('../../src/Zoroaster')

module.exports = {
  async 'should increase balance when doing good deed'() {
    const zoroaster = new Zoroaster()
    const res = await zoroaster.side(Zoroaster.AHURA_MAZDA) // follow path of truth
    assert(res) // should have successfully sided with Good
    assert(zoroaster.balance === 1)
  },
  async 'should decrease balance when doing bad deed'() {
    const zoroaster = new Zoroaster()
    const res = await zoroaster.side(Zoroaster.ANGRA_MAINYU) // follow way of falsehood
    assert(res) // should have successfully sided with Evil
    assert(zoroaster.balance === -1)
  },
  async 'should throw an error when choosing an unknown side'() {
    const zoroaster = new Zoroaster()
    await throws({
      async fn() { await zoroaster.side(Zoroaster.MAGI) }, // follow yet unknown way
      message: 'Unknown side',
    })
  },
}
