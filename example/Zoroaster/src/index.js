import read from '@wrote/read'
import write from '@wrote/write'

const sayings = [
  'One repays a teacher badly if one always remains nothing but a pupil',
  'Turn yourself not away from three best things: Good Thought, Good Word, and Good Deed.',
  'A reflective, contented mind is the best possession.',
]

export default class Zoroaster {
  constructor(name = 'Zarathustra') {
    this.name = name
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
  async translateAndSave(path, output) {
    const r = await read(path)
    const translation = `Do Thou strengthen my body (O! Hormazd)
through good thoughts, righteousness, strength (or power)
and prosperity.`
    await write(output, translation)
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
    return this.balance == 1000
  }
  get countryOfOrigin() {
    return 'Persia'
  }
  get dateOfBirth() {
    return -628
  }
  static get AHURA_MAZDA() {
    return 1
  }
  static get ANGRA_MAINYU() {
    return 2
  }
}
