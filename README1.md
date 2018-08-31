<!-- ### Function Context (deprecated as of 2.1)

> THIS SHOULD NOT REALLY BE USED AS OF `2.1` WHICH INTRODUCED THE CLASS CONTEXT FEATURE BECAUSE IT'S EASIER TO DOCUMENT A CLASS WITHOUT HAVING TO HACK A DOCTYPE.

If the `context` property is a function, then it will be asynchronously evaluated, and its `this` used as a context for tests. The timeout for evaluation is equal to the test timeout. The context should also be documented with a JSDoc for IntelliSence support in tests.

```js
const getCountry = async () => 'Iran'

export default async function context() {
  // an async set-up
  await new Promise(r => setTimeout(r, 50))
  this.getCountry = getCountry

  this._destroy = async () => {
    // an async tear-down
    await new Promise(r => setTimeout(r, 50))
  }
}

/**
 * @typedef {Object} Context
 * @property {getCountry} getCountry Returns country of origin.
 */

const Context = {}

export { Context }
```

```js
import { equal } from 'assert'
import Zoroaster from '../../src'
import context, { Context } from '../context' // eslint-disable-line no-unused-vars

/** @type {Object.<string, (ctx: Context)>} */
const T = {
  context,
  async 'returns correct country of origin'({ getCountry }) {
    const zoroaster = new Zoroaster()
    const expected = await getCountry()
    equal(zoroaster.countryOfOrigin, expected)
  },
}

export default T
``` -->

---

Copyright 2018 [Art Deco Code][1]
