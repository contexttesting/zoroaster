// alamode: runs a test for source compiled with alamode
-a test/fixture/alamode/test.js

/* expected */
test/fixture/alamode/test.js
  ✓  runs erte
  ✓  runs c
  ✗  runs b
  | AssertionError [ERR_ASSERTION]: 'b' == 'a'
  |     at runs b (/test/fixture/alamode/test.js:15:5)

test/fixture/alamode/test.js > runs b
  AssertionError [ERR_ASSERTION]: 'b' == 'a'
      at runs b (/test/fixture/alamode/test.js:15:5)

🦅  Executed 3 tests: 1 error.
/**/

// !alamode: runs a test for code compiled with babel
-a test/fixture/babel/test.js

/* expected */
test/fixture/alamode/test.js
  ✓  runs erte
  ✓  runs c
  ✗  runs b
  | AssertionError [ERR_ASSERTION]: 'b' == 'a'
  |     at runs b (/test/fixture/alamode/test.js:15:5)

test/fixture/alamode/test.js > runs b
  AssertionError [ERR_ASSERTION]: 'b' == 'a'
      at runs b (/test/fixture/alamode/test.js:15:5)

🦅  Executed 3 tests: 1 error.
/**/