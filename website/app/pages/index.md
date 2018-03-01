# Zoroaster is a Testing Framework for Node.js

``zoroaster`` is a cool testing framework for Node.js. Unlike _mocha_ and _jasmine_, it does not
export global functions like _describe_, _it_, _before_, _beforeAll_, _breforeEach_, but has a
notion of a *Text Context* -- an on object with a state, initiliased and destroyed for each test.

Each ``zoroaster`` test suite must be exported with `module.exports` in its file, and then
`zoroaster test` command can be used to start testing.

## Why and how to Use Zoroaster?

You should use ``zoroaster`` if you are tired of old-age paradigms and dictated standards, want to do
something different, and be in control of your development process.

To install it do, `npm i zoroaster` in your project directory, and specify the following npm script:

```json
"scripts": {
  "test": "zoroaster test",
  "test-watch": "zoroaster test --watch"
}
```

When working with ``zoroaster``, you write your tests as properties of a *test suite* object, where
you can nest test suites. Let's look at an example, where we want to test `myModule`:

```js
// src/index.js

const myModule = (arg) => {
    if (arg === null) {
        throw new Error('Cannot pass null')
    }
    return 'the-right-thing'
}

module.exports = myModule
```

The function returns a string, and throws if argument is `null`. Create a new test file in the
_test_ directory.

```js
// test/index.js

const assert = require('assert')
const myModule = require('../src/')

const myModuleTestSuite = {
    'should do the right thing': () => {
        const expected = 'the-right-thing'
        const res = myModule()
        assert.equal(res, expected)
    },
    'should throw an error with incorrect output': () => {
        assert.throws(() => {
            myModule(null)
        }, /Cannot pass null/)
    },
}

module.exports = myModuleTestSuite
```

In our test, we export a test suite with 2 tests. As opposed to _mocha_, we  don't call `it` to
declare tests, but pass functions as a values in the test suite map.

To execute tests, we use _CLI_ command:

```bash
$ zoroaster examples
```

This should produce the following output:

```fs
 examples/index.js
  ✓  should do the right thing
  ✓  should throw an error with incorrect output

Executed 2 tests.
```


## Examples

Here are some examples of using ``zoroaster`` for testing Node modules:

* [node-exiftool](https://github.com/Sobesednik/node-exiftool/blob/master/test/spec/exiftool.js)
* [wrote](https://github.com/Sobesednik/wrote/blob/master/test/spec/write.js)
* [mnp](https://github.com/Sobesednik/mnp/blob/master/test/spec/write-to-config.js)
