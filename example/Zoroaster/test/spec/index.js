import { ok, equal } from 'assert'
import Zoroaster from '../../src'

export default {
  // standard test function
  'has static variables'() {
    ok(Zoroaster.AHURA_MAZDA)
    ok(Zoroaster.ANGRA_MAINYU)
  },

  // recursive test suites
  constructor: {
    'creates a new Zoroaster instance with default name'() {
      const zoroaster = new Zoroaster()
      ok(zoroaster instanceof Zoroaster)
      equal(zoroaster.name, 'Zarathustra')
    },
    'creates a new Zoroaster instance with a name'() {
      const name = 'Ashu Zarathushtra'
      const zoroaster = new Zoroaster(name)
      equal(zoroaster.name, name)

      const name2 = 'Zarathushtra Spitama'
      const zoroaster2 = new Zoroaster(name2)
      equal(zoroaster2.name, name2)
    },
    'has a balance of 0 when initialised'() {
      const zoroaster = new Zoroaster()
      equal(zoroaster.balance, 0)
    },
  },

  // asynchronous test pattern
  async 'decreases and increase balance asynchronously'() {
    const zoroaster = new Zoroaster()
    await new Promise(r => setTimeout(r, 50))
    await zoroaster.side(Zoroaster.ANGRA_MAINYU)
    equal(zoroaster.balance, -1)

    await new Promise(r => setTimeout(r, 50))
    await zoroaster.side(Zoroaster.AHURA_MAZDA)
    equal(zoroaster.balance, 0)
  },
}
