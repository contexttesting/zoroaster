import { equal } from 'assert'
import Zoroaster from '../../src'
import Context from '../context'

/** @type {Object.<string, (ctx: Context)>} */
const T = {
  context: Context,
  async 'returns correct country of origin'({ getCountry }) {
    const zoroaster = new Zoroaster()
    const expected = await getCountry()
    equal(zoroaster.countryOfOrigin, expected)
  },
}

export default T
