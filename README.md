# Zoroaster

[![npm version](https://badge.fury.io/js/zoroaster.svg)](https://badge.fury.io/js/zoroaster)
[![Build Status](https://travis-ci.org/artdecocode/zoroaster.svg?branch=master)](https://travis-ci.org/artdecocode/zoroaster)
[![Build status](https://ci.appveyor.com/api/projects/status/1gc2cqf97ty69mfw/branch/master?svg=true)](https://ci.appveyor.com/project/zavr-1/zoroaster/branch/master)

An Art Deco JavaScript testing framework for _Node.js_.

[![](doc/graphics/movflamecolumn.gif)](https://zoroaster.co.uk)
[![](doc/graphics/movzcard.gif)](http://www.crystalinks.com/zoroaster.html)
[![](doc/graphics/movflamecolumn.gif)](https://artdecocode.bz)

Are you fed up with `mocha` or have you had enough of `chai` in your life?
Is it not time to say good-bye to the old stereotype that the same software must
be used every day? Say no more, `zoroaster` is here to save our souls and bring
a change.

```js
// zoroaster example.js
import { assert, equal } from 'zoroaster/assert'

const software = (type) => {
  switch (type) {
    case 'boolean':
      return true
    case 'string':
      return 'string'
    default:
      return null
  }
}

const asyncSoftware = async (type) => {
  await new Promise(r => setTimeout(r, 50))
  return software(type)
}

export default {
  'should run a test'() {
    const res = software('boolean')
    assert(res)
  },
  async 'should run an async test'() {
    const res = await asyncSoftware('string')
    equal(res, 'string')
  },
}
```

![tests results](doc/tests.png)

## Try Zoroaster Today!

Zoroaster allows to write test cases as simple functions, without using
framework-specific global variables such as `describe`,  `it`, `before` and
`after`. Save it for the after-life. Export test suites as modules and run them
with `zoroaster` binary.

Read the main idea behind `zoroaster` below, or skip to the [example](#example) to get started.

### Each Directory is a Test Suite

It's much easier to organise test cases by JavaScript files in directories and
not by nested function blocks in a single file. Files can be moved around much
more easily and are more atomic.

Normally, a directory is a test suite because it groups files together by
functionality, and as libraries' features develop, their test directory should
grow more files inside -- testing new features. It's more desirable to create
many smaller files sorted by directories, rather than put all tests in a single
file.

However, it's understandable why one would go down the second route -- this is
because the traditional frameworks have an inherent limitation in them. They
force developers to reuse single _set-up_ and _tear-down_ functions such as
`beforeEach` and `afterEach` within the same file because there's no way to make
them run across multiple files without duplicating the code. Consider example
below to understand this point better.

A project has `src` directory and is tested with `mocha`, with tests in `test`
directory.

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

The test suites are for the `night` and `day`. Set-up `beforeEach`'s purpose is
to open some connections, and tear-down `afterEach`'s purpose is to make sure
that all the connections are closed.

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

It's impossible to reuse `beforeEach` and `afterEach` by simply creating a new
file in their parent directory, such as

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

### Context as Alternative Solution

Think of a test context which can be asynchronously initialised, and
asynchronously destroyed. The `context` can be reused across multiple test
suites at ease. This method combines ye olde `beforeEach` and `afterEach` into
a controlled state for each individual test case. Just have a look at some of
the examples below.

A recommended structure us to have `spec` and `context` directories.

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

A context can and mostly will be asynchronous, but it doesn't have to be.
The body of the context is the set-up for each test, i.e., `beforeEach`. If
implementation of `_destroy` is provided, which can also be async, it will be
called on the tear-down, i.e., `afterEach`. Therefore, we decouple the context
from the test.

```js
// test/context/index.js
async function Context() {
  this.connections = await makeConnections() // create some connections
  this._destroy = () => {
    this.connections.close() // ensure destruction
  }

}
```

Context is specified as a property of a test suite, and is passed as an argument
to the test case functions when it's their time to execute. Context can be
reused across multiple packages, for example, `temp-context` makes it super
easy to create temp directories for testing, and remove them.

```js
// test/spec/light/night
import { context } from '../context'

const nightTestSuite = {
  context,
  'should be no light at night'(ctx) {
    ctx.connections.open()
    // night at 0
    ctx.connections.sendTime(0)
    ctx.connections.close()
  }
}
```

A cool thing is that you can destructure the context argument and declare only
the bits of the context that you're interested in.

```js
// test/spec/light/day
import { context } from '../context'

const dayTestSuite = {
  context,
  'should be light at day'({ connections }) {
    // day at 12
    connections.open()
    connections.sendTime(12)
    connections.close()
  }
}
```

Consequently, all of this means that test contexts can be tested separately,
which is perfect for when it is required to ensure quality of tests.

In this section, we tried to give a brief overview of why `zoroaster` with its
`Contexts` should become your new daily routine. The advantage is that you're
more flexible in organising the `test` directory which is harder with
`beforeEach` and `afterEach` in _other_ testing frameworks.

## Example

See how to write tests with `Zoroaster` in this section.

First, create a module which exports a TEST SUITE as an object in the
`test/spec` directory. Second, add TESTS as functions -- properties of the test
suite. Implement the tests with basic assertion methods required from
`zoroaster/assert`, or use any other assertion library.

There are NO global functions. You need to know 2 things: tests are methods
of test suites, and they can be written in shorthand notation
(`var o = { foo(){} };`).

```js
import { assert, equal } from 'zoroaster/assert'
import Zoroaster from '../src/Zoroaster'

const Zoroaster_test_suite = {
  'should have static variables'() { // awesome shorthand method notation
    assert(Zoroaster.AHURA_MAZDA)
    assert(Zoroaster.ANGRA_MAINYU)
  },

  // nested test suites
  standard_constructor: {
    'should create a new Zoroaster instance with default name'() {
      const zoroaster = new Zoroaster()
      assert(zoroaster instanceof Zoroaster)
      equal(zoroaster.name, 'Zarathustra')
    },
    world: {
      'should create a world'() {
        const zoroaster = new Zoroaster()
        zoroaster.createWorld()
        equal(zoroaster.balance, 100)
      },
      'should destroy a world'() {
        const zoroaster = new Zoroaster()
        zoroaster.createWorld()
        zoroaster.destroyWorld()
        equal(zoroaster.balance, 0)
      },
    },
  },
  // ...
}

module.exports = Zoroaster_test_suite
```

### async functions

Async functions are perfect to test with [`zoroaster testing framework`][2] due to the concise async shorthand method notation.

```js
{
  // wow what syntax
  async 'should return true when balance of 1000 met'() {
    const zoroaster = new Zoroaster()
    zoroaster.createWorld()
    await Promise.all(
      Array.from({ length: 900 }).map(async () => {
        await zoroaster.side(Zoroaster.AHURA_MAZDA)
      })
    )
    equal(zoroaster.balance, 1000)
    assert(zoroaster.checkParadise())
  },
  // ...
}
```

All tests have to complete within the specified [timeout](#timeout).

<!-- Have a go at writing interactive tests yourself at [`Zoroaster Playground`][3]. -->

### Running Example

To run the example test file, execute

```sh
zoroaster examples/test/Zoroaster_test.js
# or
yarn example
```

This will run the constructor test suite, which also requires methods as
paths, therefore we're not testing the whole directory (otherwise, the methods
would be tested twice, e.g., try `zoroaster examples/test`).

```fs
UNKNOWN:zoroaster user$ yarn example
yarn run v1.5.1
$ zoroaster examples/test/Zoroaster_test.js
 examples/test/Zoroaster_test.js
  ✓  should have static variables
  ✓  should decrease and increase balance asynchronously
   standard_constructor
    ✓  should create a new Zoroaster instance with default name
    ✓  should create a new Zoroaster instance with a name
    ✓  should have balance of 0 when initialised
   methods
    ✓  should create a world
    ✓  should destroy a world
     side
      ✓  should increase balance when doing good deed
      ✓  should decrease balance when doing bad deed
      ✓  should throw an error when choosing an unknown side
     say
      ✓  should say a sentence
     checkParadise
      ✓  should return true when balance of 1000 met
      ✓  should return false when balance is less than 1000
   object context
    ✓  should set correct name
     innerMeta
      ✓  should access parent context
      ✓  should return correct date of birth
   async context
    ✓  should return correct country of origin

🦅  Executed 17 tests.
✨  Done in 0.66s.
```

## CLI

This section describes how to use `zoroaster` from command-line interface.
The `zoroaster` bin is written for Node 8.6, and for older versions transpiled
`zoroaster-es5` can be used.

```sh
zoroaster test/spec
#or
zoroaster-es5 test/spec
```

### Recursive Resolve

If a folder is passed as an argument, it will be tested recursively: all modules
inside of it will be run required tests, and all directories initialised as
nested test suites.

```sh
zoroaster examples/test/methods
```

```fs
 examples/test/methods
   say.js
    ✓  should say a sentence
   side.js
    ✓  should increase balance when doing good deed
    ✓  should decrease balance when doing bad deed
    ✓  should throw an error when choosing an unknown side

Executed 4 tests.
```

### Multiple files

If multiple destinations are passed, they are all tested.

```sh
zoroaster examples/test/methods/say.js examples/test/methods/side.js
```

```fs
 examples/test/methods/say.js
  ✓  should say a sentence
 examples/test/methods/side.js
  ✓  should increase balance when doing good deed
  ✓  should decrease balance when doing bad deed
  ✓  should throw an error when choosing an unknown side

Executed 4 tests.
```

### Watch

To watch files for changes, use `--watch` flag, e.g.,

```sh
zoroaster examples/test/Zoroaster_test.js --watch
```

### Timeout

The default timeout is `2000ms`. At the moment, only global timeout
can be set with the `ZOROASTER_TIMEOUT` environment variable, e.g.,
`ZOROASTER_TIMEOUT=5000 zoroaster test`

### @babel/register

If you want to use `@babel/register` in your tests, just pass `--babel` flag
to the CI. It will make a call to require `@babel/register`, so that it must
be installed as a dependency in your project, because it's not specified as
`zoroaster`'s dependency.

```sh
zoroaster test/spec --babel
```

### package.json

To be able to run `yarn test`, or `npm test`, specify the test script in the
`package.json` as follows:

```json
{
  "name": "test-package",
  "scripts": {
    "test": "zoroaster test/spec"
  }
}
```

## Context

Add `context` property to a test suite, and access it from a test function's
first argument. It can be specified as an object, or as a function. If it is an
object, it will be frozen and passed to the test cases as `ctx` argument.
It can also be extended by inner test suites.

```js
{
  'object-context': {
    context: {
      name: 'Zarathustra',
    },
    'should set correct name'({ name }) {
      const zoroaster = new Zoroaster()
      equal(zoroaster.name, name)
    },
    innerMeta: {
      // inner context extends outer one
      context: {
        born: -628,
      },
      'should return correct date of birth'({ name, born }) {
        const zoroaster = new Zoroaster()
        equal(zoroaster.name, name)
        equal(zoroaster.dateOfBirth, born)
      },
    },
  },
  // ...
}
```

If `context` property is a function, then it will be asynchronously evaluated,
and its `this` used as a context for tests. The timeout for evaluation is equal
to the test timeout.

```js
{
  'async-context': {
    async context() {
      // an async set-up
      await new Promise(r => setTimeout(r, 50))
      this.getCountry = async () => 'Iran'

      this._destroy = async () => {
        // some async tear-down
        await new Promise(r => setTimeout(r, 50))
      }
    },
    async 'should return correct country of origin'({ getCountry }) {
      const zoroaster = new Zoroaster()
      const expected = await getCountry()
      equal(zoroaster.countryOfOrigin, expected)
    },
  },
  // ...
}
```

Test suite context cannot be updated from within tests.

## Assertion Library

`zoroaster/assert` exports a module which has the following properties for
assertions in tests:

- `equal` which is `require('assert').equal` for equality assertions on
primitives such as strings.
- `deepEqual` which is `require('assert-diff').deepEqual` for assertions of
complex objects, with red/green difference highlighting.
- `throws` which is `require('assert-throws')` for assertions on
synchronous/asynchronous function calls.
- `assert` and `assertDiff` which are aliases to the above packages.

### throws

Use awesome `assert-throws` to test asynchronous throws instead of
`chai-as-promised` -- leave it behind as not needed.

```js
import { throws } from 'zoroaster/assert'

{
  // ...
  async 'should throw an error when choosing an unknown side'() {
    const zoroaster = new Zoroaster()
    await throws({
      async fn() { await zoroaster.side(Zoroaster.MAGI) }, // follow yet unknown way
      message: 'Unknown side',
    })
  },
  // ...
}
```

See [`assert-throws` API documentation][4] to learn more about assertions.

## launch.json

The following snippet can be used when debugging tests.

```json
{
  "type": "node",
  "request": "launch",
  "name": "Launch Program",
  "program": "${workspaceFolder}/bin/zoroaster",
  "args": [
    "test/spec/integration.js"
  ],
  "env": {
    "ZOROASTER_TIMEOUT": "9999999"
  },
  "console": "integratedTerminal",
  "skipFiles": [
    "<node_internals>/**/*.js"
  ]
}
```

## Passing Paths to Test Suites

If you want to, you can pass paths to the test files as properties of a test
suite.

```js
{
  // ...
  methods: {
    // pass a test suite as a path to the file
    side: resolve(__dirname, 'methods/side'),
    say: resolve(__dirname, 'methods/say'),
  },
  // ...
}
```

The purpose of this is to allow flexibility, however it's more usual to pass a
directory path to the CLI tool, so this feature is not commonly used.

## TODO

1. JS API
2. time-outs - specific for each test, blocked by `context` feature (10)
3. Write tests which spawn child_process to test `bin/zoroaster` executable
4. Add more reasons why to use _Zoroaster_ to readme
5. Parallel execution with `--parallel` flag
6. Only and Exclude
7. Zoroaster for browsers and Karma
8. Event listeners
9. ~~Progress stream~~
10. ~~Context object as an optional argument to test functions~~
11. Pass path to a context file in CLI
12. Catch global errors

### context-related todo

 - ~~write readme about context function~~
 - ~~add examples of context function~~
 - write tests for new TestSuite(..., timeout), release `context.timeout` feature
 - accept context as a class
 - only pass context to test functions which accept it
 - find a way to use `JSDOC` with tests

---

Copyright 2018 [Art Deco Code][1]

[1]: https://artdeco.bz
[2]: #assertion-library
[3]: https://zoroaster.co.uk
[4]: https://zoroaster.co.uk/playground
[5]: https://npmjs.org/packages/assert-throws
