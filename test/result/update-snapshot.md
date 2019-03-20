## !handles snapshot updates
-a test/fixture/snapshot-ts-update.js -r test/fixture -i

/* stdout */
 test/fixture/snapshot-ts-update.js
fineok
Update snapshot for updates current snapshot and passes (y/n)? [y] y
  ✓  updates current snapshot and passes
fineok
Update snapshot for does not update current snapshot and fails (y/n)? [y] n
  ✗  does not update current snapshot and fails
  | Error: The string didn't match the snapshot.

test/fixture/snapshot-ts-update.js > does not update current snapshot and fails
  Error: The string didn't match the snapshot.

🦅  Executed 2 tests: 1 error.
/**/

/* expected */
# snapshot-ts-update/does-not-update-current-snapshot-and-fails.txt

fine

# snapshot-ts-update/updates-current-snapshot-and-passes.txt

ok
/**/