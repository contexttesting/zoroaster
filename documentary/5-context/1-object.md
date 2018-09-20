### Object Context

When specified as an object, the context it will be frozen and passed to test cases as an argument. It can also be extended by inner test suites.

```js
import { equal } from 'assert'
import Zoroaster from '../../src'

const context = {
  name: 'Zarathustra',
}

/** @type {Object.<string, (c: context)>} */
const T = {
  context,
  'sets correct default name'({ name }) {
    const zoroaster = new Zoroaster()
    equal(zoroaster.name, name)
  },
  innerMeta: {
    // inner context extends outer one
    context: {
      born: -628,
    },
    'accesses parent context'({ name }) {
      const zoroaster = new Zoroaster()
      equal(zoroaster.name, name)
    },
    'returns correct date of birth'({ born }) {
      const zoroaster = new Zoroaster()
      equal(zoroaster.dateOfBirth, born)
    },
  },
}

export default T
```