
### Context as Alternative Solution

Think of a test context which can be asynchronously initialised, and asynchronously destroyed. The `context` can be reused across multiple test suites at ease. This method combines the `beforeEach` and `afterEach` into a controlled state for each individual test case. Just have a look at some of the examples below.

A recommended structure is to have `spec` and `context` directories.

```fs
# an updated project structure
- src
- test
  - context
    - index.js
  - spec
    - light
      - night.js
      - day.js
    - earth
      - sea.js
```

A context can and mostly will be asynchronous, but it doesn't have to be. The body of the context is the set-up for each test, i.e., `beforeEach`. By assigning properties to `this`, we make them available for tests. If implementation of `_destroy` is provided, which can also be async, it will be called on the tear-down, i.e., `afterEach`. Therefore, we decouple the context from the test.

```js
// test/context/index.js
async function Context() {
  this.connections = await makeConnections() // create some connections
  this._destroy = () => {
    this.connections.close() // ensure destruction
  }

}
```

Context is specified as a property of a test suite, and is passed as an argument to the test case functions when it's their time to execute. Context can be reused across multiple packages, for example, `temp-context` makes it super easy to create temp directories for testing, and remove them, and `snapshot-context` provides API to create and assert against snapshots.

```js
// test/spec/light/night
import { context } from '../context'

const nightTestSuite = {
  context,
  'has no light at night'(ctx) {
    ctx.connections.open()
    // night at 0
    ctx.connections.sendTime(0)
    ctx.connections.close()
  }
}
```

A cool thing is that you can destructure the context argument and declare only the bits of the context that you're interested in.

```js
// test/spec/light/day
import { context } from '../context'

const dayTestSuite = {
  context,
  'is light at day'({ connections }) {
    // day at 12
    connections.open()
    connections.sendTime(12)
    connections.close()
  }
}
```

Consequently, all of this means that test contexts can be tested separately, which is perfect for when it is required to ensure quality of tests.

In this section, we tried to give a brief overview of why `zoroaster` with its `Contexts` should become your new daily routine. The advantage is that you're more flexible in organising the `test` directory which is harder with `beforeEach` and `afterEach` in _other_ testing frameworks.