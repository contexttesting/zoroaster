## handles snapshots
-a test/fixture/snapshot-ts.js

/* stdout */
 test/fixture/snapshot-ts.js
ok
Save snapshot for compares the test result against snapshot (y/n)? [y] y
  ✓  compares the test result against snapshot

🦅  Executed 1 test.
/**/

/* expected */
# test/fixture/snapshot-ts/compares-the-test-result-against-snapshot.txt

ok
/**/

## handles snapshots with root
-a test/fixture/snapshot-ts.js -r test/fixture

/* expected */
# snapshot-ts/compares-the-test-result-against-snapshot.txt

ok
/**/

## uses existing snapshots
-a test/fixture/snapshot-ts.js -s test/fixture/snapshot/correct -r test/fixture

/* stdout */
 test/fixture/snapshot-ts.js
  ✓  compares the test result against snapshot

🦅  Executed 1 test.
/**/

/* expected */

/**/

## throws an error when snapshots don't match
-a test/fixture/snapshot-ts.js -s test/fixture/snapshot/incorrect -r test/fixture

/* stdout */
 test/fixture/snapshot-ts.js
incorrectk
  ✗  compares the test result against snapshot
  | Error: The string didn't match the snapshot.

test/fixture/snapshot-ts.js > compares the test result against snapshot
  Error: The string didn't match the snapshot.

🦅  Executed 1 test: 1 error.
/**/

## throws an error when snapshots of different kind
-a test/fixture/snapshot-ts.js -s test/fixture/snapshot/types -r test/fixture

/* stdout */
 test/fixture/snapshot-ts.js
  ✗  compares the test result against snapshot
  | Snapshot of another type exists: test/fixture/snapshot/types/snapshot-ts/compares-the-test-result-against-snapshot.json

test/fixture/snapshot-ts.js > compares the test result against snapshot
  Snapshot of another type exists: test/fixture/snapshot/types/snapshot-ts/compares-the-test-result-against-snapshot.json

🦅  Executed 1 test: 1 error.
/**/