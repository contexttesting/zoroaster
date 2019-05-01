### throws

The [`assert-throws`][5] is the best way to test whether possibly asynchronous functions throw required errors.

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

See [`assert-throws` API documentation][5] to learn more about assertions.

%~%