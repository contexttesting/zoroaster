### Multiple Contexts

It is possible to specify multiple contexts by passing an array to the `context` property.

```js
import Zoroaster from '../../src'
import Context from '../context'
import SnapshotContext from 'snapshot-context'
import { resolve } from 'path'

const SNAPSHOT_DIR = resolve(__dirname, '../snapshot')

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
const T = {
  context: [
    context,
    snapshotContext,
  ],
  async 'returns correct country of origin'({ getCountry }, { test, setDir }) {
    setDir(SNAPSHOT_DIR)
    const zoroaster = new Zoroaster()
    const expected = await getCountry()
    const actual = zoroaster.countryOfOrigin
    await test(actual, expected)
  },
}

export default T
```

%~%