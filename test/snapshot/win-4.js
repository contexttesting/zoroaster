const expectedWin4 = ` [fixtures_path]
   test_suite.js
   \u001b[32m ✓ \u001b[0m test1
   \u001b[31m ✗ \u001b[0m test2
    | Error: When you are in doubt abstain.
    |     at test2 ([fixture_path]:10:11)
   \u001b[32m ✓ \u001b[0m test3
   \u001b[32m ✓ \u001b[0m test4
   \u001b[32m ✓ \u001b[0m test5
   \u001b[31m ✗ \u001b[0m test6
    | Error: Error from Promise constructor
    |     at null._onTimeout ([fixture_path_async]:41:25)

\u001b[31m[fixtures_path] > test_suite.js > test2\u001b[0m
  Error: When you are in doubt abstain.
      at test2 ([fixture_path]:10:11)

\u001b[31m[fixtures_path] > test_suite.js > test6\u001b[0m
  Error: Error from Promise constructor
      at null._onTimeout ([fixture_path_async]:41:25)

Executed 6 tests: 2 errors.

`

module.exports = expectedWin4
