## alamode: runs a test for source compiled with alamode
-a test/fixture/alamode.js

/* stdout */
 test/fixture/alamode.js
  ✓  runs erte
  ✓  runs c
  ✗  runs b
  | AssertionError [ERR_ASSERTION]: 'b' == 'a'
  |     at runs b (/test/fixture/alamode.js:15:5)

test/fixture/alamode.js > runs b
  AssertionError [ERR_ASSERTION]: 'b' == 'a'
      at runs b (/test/fixture/alamode.js:15:5)

🦅  Executed 3 tests: 1 error.
/**/

## alamode: runs a test for code compiled with babel
-a test/fixture/babel.js

/* stdout */
 test/fixture/babel.js
  ✓  runs erte
  ✓  runs c
  ✗  runs b
  | AssertionError [ERR_ASSERTION]: 'b' == 'a'
  |     at runs b (/test/fixture/babel.js:15:5)

test/fixture/babel.js > runs b
  AssertionError [ERR_ASSERTION]: 'b' == 'a'
      at runs b (/test/fixture/babel.js:15:5)

🦅  Executed 3 tests: 1 error.
/**/

## runs a test suite
test/fixtures/test-suite.js -a -t 250

/* stdout */
 test/fixtures/test-suite.js
  ✗  failingTest
  | Error: When you are in doubt abstain.
  |     at failingTest (/test/fixtures/tests.js:8:9)
  ✗  asyncFailingTest
  | Error: When you are in doubt abstain.
  |     at asyncFailingTest (/test/fixtures/tests.js:12:9)
  ✓  asyncTest
  ✗  contextFailingTest
  | Error: When you are in doubt abstain.
  |     at contextFailingTest (/test/fixtures/tests.js:20:9)
  ✗  asyncContextFailingTest
  | Error: When you are in doubt abstain.
  |     at Timeout.setTimeout [as _onTimeout] (/test/fixtures/tests.js:28:16)
  |     at asyncContextFailingTest (/test/fixtures/tests.js:24:13)
  ✓  contextPassingTest
  ✗  timeoutFailingTest
  | Error: Test has timed out after 250ms
  ✓  test

test/fixtures/test-suite.js > failingTest
  Error: When you are in doubt abstain.
      at failingTest (/test/fixtures/tests.js:8:9)

test/fixtures/test-suite.js > asyncFailingTest
  Error: When you are in doubt abstain.
      at asyncFailingTest (/test/fixtures/tests.js:12:9)

test/fixtures/test-suite.js > contextFailingTest
  Error: When you are in doubt abstain.
      at contextFailingTest (/test/fixtures/tests.js:20:9)

test/fixtures/test-suite.js > asyncContextFailingTest
  Error: When you are in doubt abstain.
      at Timeout.setTimeout [as _onTimeout] (/test/fixtures/tests.js:28:16)
      at asyncContextFailingTest (/test/fixtures/tests.js:24:13)

test/fixtures/test-suite.js > timeoutFailingTest
  Error: Test has timed out after 250ms

🦅  Executed 8 tests: 5 errors.
/**/

## runs a jsx test suite
test/fixture/test -a

/* stdout */
 test/fixture/test
  ✓  asyncTest

🦅  Executed 1 test.
/**/

/* stderr */
<div><h1>Hello World</h1>Tested By Depack</div>
/**/