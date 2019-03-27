import { equal } from 'assert'
import Zoroaster from '../../src'
import Context from '../context'

/** @type {Object.<string, (ctx: Context)>} */
const T = {
  context: Context,
  async 'returns correct country of origin'({
    country: expectedOrigin,
  }) {
    const zoroaster = new Zoroaster()
    equal(zoroaster.countryOfOrigin, expectedOrigin)
  },
}

export default T
