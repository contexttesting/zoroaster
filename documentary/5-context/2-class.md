### Class Context

Context can be a class, and to initialise it, `_init` function will be called if present. All methods in the context **will be bound** to the instance of a context for each tests, therefore it's possible to use destructuring and still have methods having access to `this`. Getters and setters are not bound.

```js
import { resolve } from 'path'

export default class Context {
  async _init() {
    // an async set-up
    await new Promise(r => setTimeout(r, 50))
  }
  /**
   * Returns country of origin.
   */
  async getCountry() {
    return 'Iran'
  }
  async _destroy() {
    // an async tear-down
    await new Promise(r => setTimeout(r, 50))
  }
  get SNAPSHOT_DIR() {
    return resolve(__dirname, '../snapshot')
  }
}
```

```js
import { equal } from 'assert'
import Zoroaster from '../../src'
import Context from '../context'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context,
  async 'returns correct country of origin'({ getCountry }) {
    const zoroaster = new Zoroaster()
    const expected = await getCountry()
    equal(zoroaster.countryOfOrigin, expected)
  },
}

export default T
```