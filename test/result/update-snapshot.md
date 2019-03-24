## handles snapshot updates
-a test/fixture/snapshot-ts-update.js -r test/fixture -i

/* existingData */
fine
/**/
/* existingType */
txt
/**/

/* stdout */
 test/fixture/snapshot-ts-update.js
fineok
Update snapshot for updates current snapshot and passes (y/n)? [y] y
  ✓  updates current snapshot and passes
fineok
Update snapshot for does not update current snapshot and fails (y/n)? [y] n
  ✗  does not update current snapshot and fails
  | Error: The string didn't match the snapshot test/temp/snapshot/snapshot-ts-update/does-not-update-current-snapshot-and-fails.txt

test/fixture/snapshot-ts-update.js > does not update current snapshot and fails
  Error: The string didn't match the snapshot test/temp/snapshot/snapshot-ts-update/does-not-update-current-snapshot-and-fails.txt

🦅  Executed 2 tests: 1 error.
/**/

/* expected */
# snapshot-ts-update/does-not-update-current-snapshot-and-fails.txt

fine

# snapshot-ts-update/updates-current-snapshot-and-passes.txt

ok
/**/

## handles snapshot types updates
-a test/fixture/snapshot-ts-update.js -r test/fixture -i

/* existingData */
{"data": "fine"}
/**/
/* existingType */
json
/**/

/* stdout */
 test/fixture/snapshot-ts-update.js
Snapshot of another type exists: test/temp/snapshot/snapshot-ts-update/updates-current-snapshot-and-passes.json.
New data:
ok
Update snapshot test/temp/snapshot/snapshot-ts-update/updates-current-snapshot-and-passes.json to a new type (y/n)? [y] y
  ✓  updates current snapshot and passes
Snapshot of another type exists: test/temp/snapshot/snapshot-ts-update/does-not-update-current-snapshot-and-fails.json.
New data:
ok
Update snapshot test/temp/snapshot/snapshot-ts-update/does-not-update-current-snapshot-and-fails.json to a new type (y/n)? [y] n
  ✗  does not update current snapshot and fails
  | Snapshot of another type exists: test/temp/snapshot/snapshot-ts-update/does-not-update-current-snapshot-and-fails.json

test/fixture/snapshot-ts-update.js > does not update current snapshot and fails
  Snapshot of another type exists: test/temp/snapshot/snapshot-ts-update/does-not-update-current-snapshot-and-fails.json

🦅  Executed 2 tests: 1 error.
/**/

/* expected */
# snapshot-ts-update/does-not-update-current-snapshot-and-fails.json

{"data": "fine"}

# snapshot-ts-update/updates-current-snapshot-and-passes.txt

ok
/**/