# Zoroaster
[![npm version](https://badge.fury.io/js/zoroaster.svg)](https://badge.fury.io/js/zoroaster)
[![Build Status](https://travis-ci.org/Sobesednik/zoroaster.svg?branch=master)](https://travis-ci.org/Sobesednik/zoroaster)
[![Build status](https://ci.appveyor.com/api/projects/status/1gc2cqf97ty69mfw/branch/master?svg=true)](https://ci.appveyor.com/project/zavr-1/zoroaster/branch/master)

A minimal JavaScript testing framework for Node.js.

[![](https://files.sobesednik.media/movflamecolumn.gif)](https://zoroaster.co.uk)
[![](https://files.sobesednik.media/movzcard.gif)](http://www.crystalinks.com/zoroaster.html)
[![](https://files.sobesednik.media/movflamecolumn.gif)](https://sobesednik.media)

Tired of using `Mocha` and `Chai` as paradigms for JS testing? Want something new and simpler?
Try Zoroaster today!
Write your test cases as simple functions, without `describe`, `it`, `before` and `after`.
Export test suites as modules and run them with `zoroaster` binary.

Why?

- Each test case should be independent of context. If you require some setup and teardown,
write pure functions in your test file, and call them from tests.
- Have more control by passing paths to your test files as properties (see example below).

## Input
To specify files to test, create a module which exports an object:
```js
// examples/test/Zoroaster_test.js

const assert = require('assert')
const path = require('path')
const Zoroaster = require('../src/Zoroaster')

const Zoroaster_test_suite = {

    // standard test function
    'should have static variables': () => {
        assert(Zoroaster.AHURA_MAZDA)
        assert(Zoroaster.ANGRA_MAINYU)
    },

    // recursive test suites
    constructor: {
        'should create a new Zoroaster instance with default name': () => {
            const zoroaster = new Zoroaster()
            assert(zoroaster instanceof Zoroaster)
            assert(zoroaster.name === 'Zarathustra')
        },
        'should create a new Zoroaster instance with a name': () => {
            const name = 'Ashu Zarathushtra'
            const zoroaster = new Zoroaster(name)
            assert(zoroaster.name === name)

            const name2 = 'Zarathushtra Spitama'
            const zoroaster2 = new Zoroaster(name2)
            assert(zoroaster2.name === name2)
        },
        'should have balance of 0 when initialised': () => {
            const zoroaster = new Zoroaster()
            assert(zoroaster.balance === 0)
        },
    },

    methods: {

        // pass a test suite as a path to the file
        side: path.join(__dirname, 'methods', 'side'),
        say: path.join(__dirname, 'methods', 'say'),

        // some more standard test cases
        createWorld: () => {
            const zoroaster = new Zoroaster()
            zoroaster.createWorld()
            assert(zoroaster.balance === 100)
        },
        destroyWorld: () => {
            const zoroaster = new Zoroaster()
            zoroaster.createWorld()
            zoroaster.destroyWorld()
            assert(zoroaster.balance === 0)
        },
        checkParadise: {
            'should return true when balance of 1000 met': () => {
                const zoroaster = new Zoroaster()
                zoroaster.createWorld()
                Array.from({ length: 900}).forEach(() => {
                    zoroaster.side(Zoroaster.AHURA_MAZDA)
                })
                assert(zoroaster.balance === 1000)
                assert(zoroaster.checkParadise())
            },
            'should return false when balance is less than 1000': () => {
                const zoroaster = new Zoroaster()
                assert(zoroaster.checkParadise() === false)
            },
        },
    },

    // asynchronous pattern: return a promise
    'should decrease and increase balance asynchronously': () => {
        const zoroaster = new Zoroaster()
        return new Promise((resolve) => {
            setTimeout(() => {
                zoroaster.side(Zoroaster.ANGRA_MAINYU)
                resolve()
            }, 200)
        })
            .then(() => new Promise((resolve) => {
                setTimeout(() => {
                    zoroaster.side(Zoroaster.AHURA_MAZDA)
                    resolve()
                }, 200)
            }))
            .then(() => {
                assert(zoroaster.balance === 0)
            })
    },
}

module.exports = Zoroaster_test_suite
```

To run the test file, execute `zoroaster examples/test/Zoroaster_test`. Each test case will be
transformed into a promise, and altogether they will be run in a sequence.

```bash
Sat, 22 Oct 2016 00:51:42 GMT
examples/test/Zoroaster_test.js
 ✓  should have static variables
 ✓  should decrease and increase balance asynchronously
    constructor
     ✓  should create a new Zoroaster instance with default name
     ✓  should create a new Zoroaster instance with a name
     ✓  should have balance of 0 when initialised
    methods
     ✓  createWorld
     ✓  destroyWorld
        side
         ✓  should increase balance when doing good deed
         ✓  should decrease balance when doing bad deed
         ✓  should throw an error when choosing an unknown side
        say
         ✓  should say a sentence
        checkParadise
         ✓  should return true when balance of 1000 met
         ✓  should return false when balance is less than 1000
```

## Recursive Resolve
Pass a folder as an argument to test it recursively. All test paths will be resolved.
`zoroaster examples/test/methods`
```bash
Sat, 22 Oct 2016 00:34:17 GMT
examples/test/methods
    say.js
     ✓  should say a sentence
    side.js
     ✓  should increase balance when doing good deed
     ✓  should decrease balance when doing bad deed
     ✓  should throw an error when choosing an unknown side
```

## Multiple files
Of course, you can test multiple files at once.
`zoroaster examples/test/methods/say.js examples/test/methods/side.js`

```bash
Sat, 22 Oct 2016 01:19:53 GMT
examples/test/methods/say.js
 ✓  should say a sentence
examples/test/methods/side.js
 ✓  should increase balance when doing good deed
 ✓  should decrease balance when doing bad deed
 ✓  should throw an error when choosing an unknown side
```

## Watch
To watch files for changes, use `--watch` flag, e.g.,
`zoroaster examples/test/Zoroaster_test --watch`.

## Timeout
The default timeout is `2000ms`. At the moment, only global timeout
can be set with the `ZOROASTER_TIMEOUT` environment variable, e.g.,
`ZOROASTER_TIMEOUT=5000 zoroaster test`

## TODO
1. JS API
2. Timeouts - specific for each test, blocked by `context` feature (10)
3. Write tests which spawn child_process to test `bin/zoroaster` executable
4. Add more reasons why to use _Zoroaster_ to readme
5. Parallel execution with `--parallel` flag
6. Only and Exclude
7. Zoroaster for browsers and Karma
8. Event listeners
9. Progress stream
10. Context object as an optional argument to test functions
11. Catch global errors

## Copyright
Copyright 2017 [Sobesednik Media](https://sobesednik.media)
