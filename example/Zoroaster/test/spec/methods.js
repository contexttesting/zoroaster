import { ok, equal } from 'assert'
import Zoroaster from '../../src'

const T = {
  'creates a world'() {
    const zoroaster = new Zoroaster()
    zoroaster.createWorld()
    equal(zoroaster.balance, 100)
  },
  'destroys a world'() {
    const zoroaster = new Zoroaster()
    zoroaster.createWorld()
    zoroaster.destroyWorld()
    equal(zoroaster.balance, 0)
  },
  'says a sentence'() {
    const zoroaster = new Zoroaster()
    const res = zoroaster.say()
    equal(typeof res, 'string')
  },
  side: {
    'increases balance when doing good deed'() {
      const zoroaster = new Zoroaster()
      const res = zoroaster.side(Zoroaster.AHURA_MAZDA) // follow path of truth
      ok(res) // should have successfully sided with Good
      equal(zoroaster.balance, 1)
    },
    'decreases balance when doing bad deed'() {
      const zoroaster = new Zoroaster()
      const res = zoroaster.side(Zoroaster.ANGRA_MAINYU) // follow way of falsehood
      ok(res) // should have successfully sided with Evil
      equal(zoroaster.balance, -1)
    },
    'throws an error when choosing an unknown side'() {
      const zoroaster = new Zoroaster()
      try {
        zoroaster.side(Zoroaster.MAGI) // follow yet unknown way
        throw new Error('Should have thrown an error')
      } catch(err) {
        equal(err.message, 'Unknown side')
      }
    },
  },
}

export const checkParadise = {
  async 'returns true when balance of 1000 met'() { // wow what syntax
    const zoroaster = new Zoroaster()
    zoroaster.createWorld()
    await Promise.all(
      Array.from({ length: 900 }).map(async () => {
        await zoroaster.side(Zoroaster.AHURA_MAZDA)
      })
    )
    equal(zoroaster.balance, 1000)
    const actual = zoroaster.checkParadise()
    ok(actual)
  },
  async 'returns false when balance is less than 1000'() {
    const zoroaster = new Zoroaster()
    await Promise.all(
      Array.from({ length: 500 }).map(async () => {
        await zoroaster.side(Zoroaster.AHURA_MAZDA)
      })
    )
    equal(zoroaster.balance, 500)
    const actual = zoroaster.checkParadise()
    ok(!actual)
  },
}

export default T
