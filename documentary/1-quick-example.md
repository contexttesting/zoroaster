## Quick Example

All _Zoroaster_ tests are written in spec files and exported as tests suites which are objects.

For example, tests can be run against sync and async methods.

%EXAMPLE: example/src.js%

The _Context_ can be used as an alternative for in-test suite set-up and tear-down routines. Anything returned by tests will be compared against snapshots that will be created upon the first run of the test.

%EXAMPLE: example/simple.js%

![Zoroaster Example Test Results](doc/zoroaster.png)

%~%