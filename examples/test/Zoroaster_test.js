const { resolve } = require('path')
const { assert, equal } = require('../../assert')
const Zoroaster = require('../src/Zoroaster')

const Zoroaster_test_suite = {
  // standard test function
  'should have static variables'() {
    assert(Zoroaster.AHURA_MAZDA)
    assert(Zoroaster.ANGRA_MAINYU)
  },

  // recursive test suites
  standard_constructor: {
    'should create a new Zoroaster instance with default name'() {
      const zoroaster = new Zoroaster()
      assert(zoroaster instanceof Zoroaster)
      equal(zoroaster.name, 'Zarathustra')
    },
    'should create a new Zoroaster instance with a name'() {
      const name = 'Ashu Zarathushtra'
      const zoroaster = new Zoroaster(name)
      equal(zoroaster.name, name)

      const name2 = 'Zarathushtra Spitama'
      const zoroaster2 = new Zoroaster(name2)
      equal(zoroaster2.name, name2)
    },
    'should have balance of 0 when initialised'() {
      const zoroaster = new Zoroaster()
      equal(zoroaster.balance, 0)
    },
  },

  methods: {
    // pass a test suite as a path to the file
    side: resolve(__dirname, 'methods/side'),
    say: resolve(__dirname, 'methods/say'),

    // some more standard test cases
    'should create a world'() {
      const zoroaster = new Zoroaster()
      zoroaster.createWorld()
      equal(zoroaster.balance, 100)
    },
    'should destroy a world'() {
      const zoroaster = new Zoroaster()
      zoroaster.createWorld()
      zoroaster.destroyWorld()
      equal(zoroaster.balance, 0)
    },
    checkParadise: {
      async 'should return true when balance of 1000 met'() { // wow what syntax
        const zoroaster = new Zoroaster()
        zoroaster.createWorld()
        await Promise.all(
          Array.from({ length: 900 }).map(async () => {
            await zoroaster.side(Zoroaster.AHURA_MAZDA)
          })
        )
        equal(zoroaster.balance, 1000)
        assert(zoroaster.checkParadise())
      },
      'should return false when balance is less than 1000'() {
        const zoroaster = new Zoroaster()
        const actual = zoroaster.checkParadise()
        assert(actual === false)
      },
    },
  },

  // asynchronous pattern: return a promise
  async 'should decrease and increase balance asynchronously'() {
    const zoroaster = new Zoroaster()
    await new Promise(r => setTimeout(r, 50))
    await zoroaster.side(Zoroaster.ANGRA_MAINYU)
    equal(zoroaster.balance, -1)

    await new Promise(r => setTimeout(r, 50))
    await zoroaster.side(Zoroaster.AHURA_MAZDA)
    equal(zoroaster.balance, 0)
  },
  'object context': {
    context: {
      name: 'Zarathustra',
    },
    'should set correct name'({ name }) {
      const zoroaster = new Zoroaster()
      equal(zoroaster.name, name)
    },
    innerMeta: {
      // inner context extends outer one
      context: {
        born: -628,
      },
      'should access parent context'({ name }) {
        const zoroaster = new Zoroaster()
        equal(zoroaster.name, name)
      },
      'should return correct date of birth'({ born }) {
        const zoroaster = new Zoroaster()
        equal(zoroaster.dateOfBirth, born)
      },
    },
  },
  'async context': {
    async context() {
      // an async set-up
      await new Promise(r => setTimeout(r, 50))
      this.getCountry = async () => 'Iran'

      this._destroy = async () => {
        // some async tear-down
        await new Promise(r => setTimeout(r, 50))
      }
    },
    async 'should return correct country of origin'({ getCountry }) {
      const zoroaster = new Zoroaster()
      const expected = await getCountry()
      equal(zoroaster.countryOfOrigin, expected)
    },
  },
}

module.exports = Zoroaster_test_suite
