## Assertion Library

_Zoroaster_ comes with an assertion library `@zoroaster/assert` that exports the following methods to be used for assertions in tests:

- <kbd>equal</kbd> which is `require('assert').equal` for equality assertions on primitives such as strings.
- <kbd>ok</kbd> which is `require('assert').ok` for truthy assertions.
- <kbd>deepEqual</kbd> which is an alias for `@zoroaster/deep-equal` for assertions of complex objects, with red/green difference highlighting. It runs `assert.strictEqual` first and then uses an algorithm to show the differences in color.
- <kbd>throws</kbd> which is an alias for `assert-throws` for assertions on the presence of errors in synchronous and asynchronous function calls.
- <kbd>assert</kbd> which is just `require('assert').equal`.