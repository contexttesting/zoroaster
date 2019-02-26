import { equal } from '../../../../assert'
import Zoroaster from '../../src'
import PersistentContext from '../context/persistent'

/** @type {Object.<string, (ctx: PersistentContext)>} */
const T = {
  persistentContext: PersistentContext,
  async 'navigates to the website'({ Page }) {
    const zoroaster = new Zoroaster()
    const expected = await Page.navigate({ url: 'https://adc.sh' })
    zoroaster.say(expected)
    equal(expected, 'hello world')
  },
}

export default T
