# zoroaster

[![npm version](https://badge.fury.io/js/zoroaster.svg)](https://badge.fury.io/js/zoroaster)
[![Build Status](https://travis-ci.org/artdecocode/zoroaster.svg?branch=master)](https://travis-ci.org/artdecocode/zoroaster)
[![Build status](https://ci.appveyor.com/api/projects/status/1gc2cqf97ty69mfw/branch/master?svg=true)](https://ci.appveyor.com/project/zavr-1/zoroaster/branch/master)

An Art Deco JavaScript testing framework for _Node.js_.

[![](doc/graphics/movflamecolumn.gif)](https://zoroaster.co.uk)
[![](doc/graphics/movzcard.gif)](http://www.crystalinks.com/zoroaster.html)
[![](doc/graphics/movflamecolumn.gif)](https://artdecocode.bz)

Are you fed up with `mocha` or have you had enough of `chai` in your life? Is it not time to say good-bye to the old stereotype that the same software must be used every day? Say no more, `zoroaster` is here to save our souls and bring a change.

```js
/* yarn example/simple.js */
import { ok, equal } from 'assert'

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
  'runs a test'() {
    const res = software('boolean')
    ok(res)
  },
  async 'runs an async test'() {
    const res = await asyncSoftware('string')
    equal(res, 'string')
  },
}
```

![tests results](doc/tests.png)

## Try Zoroaster Today!

Zoroaster allows to write test cases as simple functions, without using framework-specific global variables such as `describe`,  `it`, `before` and `after`. Save it for the after-life. Export test suites as modules and run them with `zoroaster` binary.

Read the main idea behind `zoroaster` below, or skip to the [example](#example) to get started.

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

## Example

See how to write tests with `Zoroaster` in this section.

First, create a module which exports a TEST SUITE as an object in the `test/spec` directory. Second, add TESTS as functions -- properties of the test suite. Implement the tests with basic assertion methods required from `zoroaster/assert`, or use any other assertion library.

There are NO global functions and tests are just methods of test suites, which can be written using shorthand notation.

```js
/* yarn example/Zoroaster */
import { ok, equal } from 'zoroaster/assert'
import Zoroaster from '../../src'

export default {
  // standard test function
  'has static variables'() {
    ok(Zoroaster.AHURA_MAZDA)
    ok(Zoroaster.ANGRA_MAINYU)
  },

  // recursive test suites
  constructor: {
    'creates a new Zoroaster instance with default name'() {
      const zoroaster = new Zoroaster()
      ok(zoroaster instanceof Zoroaster)
      equal(zoroaster.name, 'Zarathustra')
    },
    'creates a new Zoroaster instance with a name'() {
      const name = 'Ashu Zarathushtra'
      const zoroaster = new Zoroaster(name)
      equal(zoroaster.name, name)

      const name2 = 'Zarathushtra Spitama'
      const zoroaster2 = new Zoroaster(name2)
      equal(zoroaster2.name, name2)
    },
    'has a balance of 0 when initialised'() {
      const zoroaster = new Zoroaster()
      equal(zoroaster.balance, 0)
    },
  },
}

export const checkParadise = {
  'returns false when balance is less than 1000'() {
    const zoroaster = new Zoroaster()
    const actual = zoroaster.checkParadise()
    ok(!actual)
  },
}
```

### async functions

Async functions are perfect to test with [`zoroaster testing framework`][2] due to the concise async shorthand method notation.

```js
{
  async 'returns true when balance of 1000 met'() {
    const zoroaster = new Zoroaster()
    zoroaster.createWorld()
    await Promise.all(
      Array.from({ length: 900 }).map(async () => {
        await zoroaster.side(Zoroaster.AHURA_MAZDA)
      })
    )
    equal(zoroaster.balance, 1000)
    const actual = zoroaster.checkParadise()
    ok(actual)
  },
}
```

All tests have to complete within the specified [timeout](#timeout).

<!-- Have a go at writing interactive tests yourself at [`Zoroaster Playground`][3]. -->

### Running Example

To run the example test file, execute

```sh
yarn example/Zoroaster/
```

```fs
yarn run v1.5.1
$ node src/bin example/Zoroaster/test/spec --babel
 example/Zoroaster/test/spec
   async-context
    ✓  returns correct country of origin
   index
    ✓  has static variables
    ✓  decreases and increase balance asynchronously
     constructor
      ✓  creates a new Zoroaster instance with default name
      ✓  creates a new Zoroaster instance with a name
      ✓  has a balance of 0 when initialised
   methods
    ✓  creates a world
    ✓  destroys a world
    ✓  says a sentence
     side
      ✓  increases balance when doing good deed
      ✓  decreases balance when doing bad deed
      ✓  throws an error when choosing an unknown side
     checkParadise
      ✓  returns true when balance of 1000 met
      ✓  returns false when balance is less than 1000
   object-context
    ✓  sets correct default name
     innerMeta
      ✓  accesses parent context
      ✓  returns correct date of birth

🦅  Executed 17 tests.
✨  Done in 0.92s.
```

## CLI

This section describes how to use `zoroaster` from command-line interface.

```sh
zoroaster test/spec
```

### Testing a Directory

If a path to a folder is passed as an argument, it will be tested recursively.

```sh
zoroaster test/spec
```

### Testing Files

If a single or multiple file paths are passed, they are all tested.

```sh
zoroaster test/spec/lib/index.js
```

### `--watch`, `-w`: Watch Files for Changes

To watch files for changes, use `--watch` (or `-w`) flag, e.g.,

```sh
zoroaster test/spec --watch
zoroaster test/spec -w
```

### Timeout

The default timeout is `2000ms`. At the moment, only global timeout can be set with the `ZOROASTER_TIMEOUT` environment variable, e.g., `ZOROASTER_TIMEOUT=5000 zoroaster test`

### `--babel`, `-b`: `require(@babel/register)`

If you want to use `@babel/register` in your tests, just pass `--babel` (or `-b`) flag to the CI. It will make a call to require `@babel/register`, so that it must be installed as a dependency in your project, because it's not specified as `zoroaster`'s dependency.

```sh
zoroaster test/spec --babel
zoroaster test/spec -b
```

When ES modules syntax (`import foo from 'foo'`) is needed (in other words, always), the following `.babelrc` pattern needs to be used:

```json
{
  "plugins": [
    "@babel/plugin-syntax-object-rest-spread",
    "@babel/plugin-transform-modules-commonjs"
  ]
}
```

With the following dev dependencies installed:

```fs
yarn add -E -D \
@babel/core \
@babel/register \
@babel/plugin-syntax-object-rest-spread \
@babel/plugin-transform-modules-commonjs
```

When building the project, you're probably using `@babel/cli` as well.

### package.json

To be able to run `yarn test`, specify the test script in the `package.json` as follows:

```json
{
  "name": "test-package",
  "scripts": {
    "test": "zoroaster test/spec"
  }
}
```

Additional shorter scripts for `yarn` can be specified (`-b` is to require `@babel/register`)

```json
{
  "scripts": {
    "t": "zoroaster -b",
    "tw": "zoroaster -b -w",
    "test": "yarn t test/spec",
    "test-watch": "yarn tw test/spec",
  }
}
```

## Context

A context is unique to each test. When added as a `context` property to a test suite, it can be accessed from test function's first argument. Test suite context cannot be updated from within tests (only its state when using a function).

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

### Class Context

Context can be a class, and to initialise it, `_init` function will be called if present. All methods in the context **will be bound** to the instance of a context for each tests, therefore it's possible to use destructuring and still have methods having access to `this`. Getters and setters are not bound.

```js
import { resolve } from 'path'

const SNAPSHOT_DIR = resolve(__dirname, '../snapshot')

export default class Context {
  /**
   * An async set-up in which country is acquired.
   */
  async _init() {
    /** @type {'Iran'} A country of origin */
    const country = await new Promise(r => setTimeout(() => r('Iran'), 50))
    this._country = country
  }
  /**
   * Returns country of origin.
   */
  getCountry() {
    return this._country
  }
  /**
   * An async tear-down in which country is destroyed
   */
  async _destroy() {
    await new Promise(r => setTimeout(r, 50))
    this._country = null
  }
  /**
   * Directory in which to save snapshots.
   */
  get SNAPSHOT_DIR() {
    return SNAPSHOT_DIR
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

### Multiple Contexts

It is possible to specify multiple contexts by passing an array to the `context` property. Passing a string or anything else than `null` will also work.

```js
import Zoroaster from '../../src'
import Context from '../context'
import SnapshotContext from 'snapshot-context'

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
const T = {
  context: [
    Context,
    SnapshotContext,
  ],
  async 'returns correct country of origin'(
    { SNAPSHOT_DIR },
    { setDir, test }
  ) {
    setDir(SNAPSHOT_DIR)
    const zoroaster = new Zoroaster()
    const actual = zoroaster.countryOfOrigin
    await test('country-of-origin.txt', actual)
  },
}

export default T
```

<!-- [![multiple-context](doc/multiple-context.gif)](https://artdecocode.bz) -->

### Function Context (deprecated as of 2.1)

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
```

## Assertion Library

`zoroaster/assert` exports a the following methods to be used for assertions in tests:

- `equal` which is `require('assert').equal` for equality assertions on primitives such as strings.
- `ok` which is `require('assert').ok` for truthy assertions.
- `deepEqual` which is `require('assert-diff').deepEqual` for assertions of complex objects, with red/green difference highlighting.
- `throws` which is `require('assert-throws')` for assertions on synchronous/asynchronous function calls.
- `assert` and `assertDiff` which are aliases to the above packages.

### throws

Use awesome [`assert-throws`][5] to test whether (asynchronous) functions throw required errors.

```js
import { throws } from 'zoroaster/assert'

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

## launch.json

The following snippet can be used when debugging tests. Because `-w` argument is also passed, the tests will automatically restart and repause at the breakpoints.

```json
{
  "type": "node",
  "request": "launch",
  "name": "Launch Zoroaster",
  "program": "${workspaceFolder}/.bin/zoroaster",
  "args": [
    "test/spec/integration.js",
    "-b",
    "-w"
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
13. Make sure source maps are updated as well when running `-w` and `-b` mode to show the correct line.

### context-related todo

 - ~~write readme about context function~~
 - ~~add examples of context function~~
 - write tests for new TestSuite(..., timeout), release `context.timeout` feature
 - accept context as a class
 - only pass context to test functions which accept it
 - find a way to use `JSDOC` with tests
 - clean stack traces when context evaluates or destroys with error

---

Copyright 2018 [Art Deco Code][1]

[1]: https://artdeco.bz
[2]: #assertion-library
[3]: https://zoroaster.co.uk
[4]: https://zoroaster.co.uk/playground
[5]: https://npmjs.org/packages/assert-throws
