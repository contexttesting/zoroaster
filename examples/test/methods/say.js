const assert = require('assert')
const Zoroaster = require('../../src/Zoroaster')

module.exports = {
    'should say a sentence': () => {
        const zoroaster = new Zoroaster()
        const res = zoroaster.say()
        assert(typeof res === 'string')
    },
}
