
### Each Directory is a Test Suite

It's much easier to organise test cases by JavaScript files in directories and not by nested function blocks in a single file. Files can be moved around much more easily and are more atomic.

Normally, a directory is a test suite because it groups files together by functionality, and as libraries' features develop, their test directory should grow more files inside -- testing new features. It's more desirable to create many smaller files sorted by directories, rather than put all tests in a single file.

However, it's understandable why one would go down the second route -- this is because the traditional frameworks have an inherent limitation in them. They force developers to reuse single _set-up_ and _tear-down_ functions such as `beforeEach` and `afterEach` within the same file because there's no way to make them run across multiple files without duplicating the code. Consider example below to understand this point better.

A project has `src` directory and is tested with `mocha`, with tests in `test` directory.

```fs
# project structure
- src
- test
  - light
    - night.js
    - day.js
  - earth
    - sea.js
```

The test suites are for the `night` and `day`. Set-up `beforeEach`'s purpose is to open some connections, and tear-down `afterEach`'s purpose is to make sure that all the connections are closed.

```js
// night.js
describe('night') {
  let connections
  beforeEach(async () => {
    connections = await makeConnections()
  })
  afterEach(() => {
    connections.close() // ensure destruction
  })
  it('should be no light at night', () => {
    connections.open()
    connections.sendTime(0)
    // assert(!light)
    connections.close()
  })
}
```

Both test suites have to repeat the same code for tests' set-up and tear-down.

```js
// day.js
describe('day') {
  let connections
  beforeEach(async () => {
    connections = await makeConnections()
  })
  afterEach(() => {
    connections.close() // ensure destruction
  })
  it('should be light at day', () => {
    connections.open()
    connections.sendTime(12)
    // connections.close()
    // ^ although connections are not closed in the test,
    // they are closed by the tear-down
  })
}
```

It's impossible to reuse `beforeEach` and `afterEach` by simply creating a new file in their parent directory, such as

```js
// test/light/set-up.js
beforeEach(async () => {
  connections = await makeConnections()
})
afterEach(() => {
  connections.close() // ensure destruction
})
```

because

* the variable `connections` are not not available in the individual test suites;
* both functions will be run for higher-level test suites (such as `earth`) as well, which is not desirable.

