import { equal } from 'zoroaster/assert'
import TempContext from 'temp-context'
import Zoroaster from '../../src'
import Context from '../context'

/** @type {Object.<string, (c: Context, t: TempContext)>} */
const T = {
  context: [Context, TempContext],
  async 'translates and saves a passage'(
    { fixture }, { resolve, read }
  ) {
    const output = resolve('output.txt')
    const zoroaster = new Zoroaster()
    const path = fixture`manthra-spenta.txt`
    await zoroaster.translateAndSave(path, output)
    const res = await read(output)
    equal(res, `
Do Thou strengthen my body (O! Hormazd)
through good thoughts, righteousness, strength (or power)
and prosperity.`
      .trim())
  },
}

export default T
