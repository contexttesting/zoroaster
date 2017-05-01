const assert = require('assert')
const path = require('path')
const Zoroaster = require('../src/Zoroaster')

const Zoroaster_test_suite = {
    // standard test function
    'should have static variables': () => {
        assert(Zoroaster.AHURA_MAZDA)
        assert(Zoroaster.ANGRA_MAINYU)
    },

    // recursive test suites
    constructor: {
        'should create a new Zoroaster instance with default name': () => {
            const zoroaster = new Zoroaster()
            assert(zoroaster instanceof Zoroaster)
            assert(zoroaster.name === 'Zarathustra')
        },
        'should create a new Zoroaster instance with a name': () => {
            const name = 'Ashu Zarathushtra'
            const zoroaster = new Zoroaster(name)
            assert(zoroaster.name === name)

            const name2 = 'Zarathushtra Spitama'
            const zoroaster2 = new Zoroaster(name2)
            assert(zoroaster2.name === name2)
        },
        'should have balance of 0 when initialised': () => {
            const zoroaster = new Zoroaster()
            assert(zoroaster.balance === 0)
        },
    },

    methods: {
        // pass a test suite as a path to the file
        side: path.join(__dirname, 'methods', 'side'),
        say: path.join(__dirname, 'methods', 'say'),

        // some more standard test cases
        createWorld: () => {
            const zoroaster = new Zoroaster()
            zoroaster.createWorld()
            assert(zoroaster.balance === 100)
        },
        destroyWorld: () => {
            const zoroaster = new Zoroaster()
            zoroaster.createWorld()
            zoroaster.destroyWorld()
            assert(zoroaster.balance === 0)
        },
        checkParadise: {
            'should return true when balance of 1000 met': () => {
                const zoroaster = new Zoroaster()
                zoroaster.createWorld()
                Array.from({ length: 900}).forEach(() => {
                    zoroaster.side(Zoroaster.AHURA_MAZDA)
                })
                assert(zoroaster.balance === 1000)
                assert(zoroaster.checkParadise())
            },
            'should return false when balance is less than 1000': () => {
                const zoroaster = new Zoroaster()
                assert(zoroaster.checkParadise() === false)
            },
        },
    },

    // asynchronous pattern: return a promise
    'should decrease and increase balance asynchronously': () => {
        const zoroaster = new Zoroaster()
        return new Promise((resolve) => {
            setTimeout(() => {
                zoroaster.side(Zoroaster.ANGRA_MAINYU)
                resolve()
            }, 200)
        })
            .then(() => new Promise((resolve) => {
                setTimeout(() => {
                    zoroaster.side(Zoroaster.AHURA_MAZDA)
                    resolve()
                }, 200)
            }))
            .then(() => {
                assert(zoroaster.balance === 0)
            })
    },
    meta: {
        context: {
            name: 'Zarathustra',
            getCountry: () => 'Iran',
        },
        countryOfOrigin: (ctx) => {
            const zoroaster = new Zoroaster()
            assert.equal(zoroaster.countryOfOrigin, ctx.getCountry())
        },
        innerMeta: {
            // inner context extends outer one
            context: {
                born: -628,
            },
            dateOfBirth: (ctx) => {
                const zoroaster = new Zoroaster()
                assert.equal(zoroaster.countryOfOrigin, ctx.getCountry())
                assert.equal(zoroaster.dateOfBirth, ctx.born)
            },
        },
    },
}

module.exports = Zoroaster_test_suite
