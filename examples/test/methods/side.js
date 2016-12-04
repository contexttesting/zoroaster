const assert = require('assert')
const Zoroaster = require('../../src/Zoroaster')

module.exports = {
    'should increase balance when doing good deed': () => {
        const zoroaster = new Zoroaster()
        const res = zoroaster.side(Zoroaster.AHURA_MAZDA) // follow path of truth
        assert(res) // should have successfully sided with Good
        assert(zoroaster.balance === 1)
    },
    'should decrease balance when doing bad deed': () => {
        const zoroaster = new Zoroaster()
        const res = zoroaster.side(Zoroaster.ANGRA_MAINYU) // follow way of falsehood
        assert(res) // should have successfully sided with Evil
        assert(zoroaster.balance === -1)
    },
    'should throw an error when choosing an unknown side': () => {
        const zoroaster = new Zoroaster()
        try {
            zoroaster.side(Zoroaster.MAGI) // follow yet unknown way
            throw new Error('Should have thrown an error')
        } catch(err) {
            assert(err.message === 'Unknown side')
        }
    },
}
