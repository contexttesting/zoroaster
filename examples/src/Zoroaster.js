'use strict'
const sayings = [
    'One repays a teacher badly if one always remains nothing but a pupil',
    'Turn yourself not away from three best things: Good Thought, Good Word, and Good Deed.',
    'A reflective, contented mind is the best possession.',
]

class Zoroaster {
    constructor(name) {
        this.name = typeof name === 'string' ? name : 'Zarathustra'
        this.balance = 0
    }
    side(option) {
        switch(option) {
        case Zoroaster.AHURA_MAZDA:
            this.balance++
            break
        case Zoroaster.ANGRA_MAINYU:
            this.balance--
            break
        default:
            throw new Error('Unknown side')
        }
        return true
    }
    say() {
        const random = Math.floor(Math.random() * 3)
        return sayings[random]
    }
    createWorld() {
        this.balance = 100
    }
    destroyWorld() {
        this.balance = 0
    }
    checkParadise() {
        return this.balance === 1000
    }
    get countryOfOrigin() {
        return 'Iran'
    }
    get dateOfBirth() {
        return -628
    }
}

Zoroaster.AHURA_MAZDA = 1
Zoroaster.ANGRA_MAINYU = 2

module.exports = Zoroaster
