## throws

The [`assert-throws`][1] library is the easiest way to test whether an asynchronous function throws expected errors.

```js
import { throws } from '@zoroaster/assert'

{
  async 'throws an error when choosing an unknown side'() {
    const zoroaster = new Zoroaster()
    await throws({
      async fn() {
        await zoroaster.side(Zoroaster.MAGI),  // follow yet unknown way
      },
      message: 'Unknown side',
    })
  },
}
```

See [`assert-throws` API documentation][1] to learn more about assertions.

[1]: https://npmjs.org/package/assert-throws
