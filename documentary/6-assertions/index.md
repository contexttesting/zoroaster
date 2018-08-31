
## Assertion Library

`zoroaster/assert` exports a the following methods to be used for assertions in tests:

- `equal` which is `require('assert').equal` for equality assertions on primitives such as strings.
- `ok` which is `require('assert').ok` for truthy assertions.
- `deepEqual` which is `require('assert-diff').deepEqual` for assertions of complex objects, with red/green difference highlighting.
- `throws` which is `require('assert-throws')` for assertions on synchronous/asynchronous function calls.
- `assert` and `assertDiff` which are aliases to the above packages.
