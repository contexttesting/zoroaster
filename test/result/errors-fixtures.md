## handles errors in streams
test/fixture/stream-errors.js -a

/* stdout */
 test/fixture/stream-errors.js
throwing error
  ✗  handles unhandled rejections
  | Error: error
  |     at reduce (/test/fixture/stream-errors.js:7:11)
  |     at <anonymous>
throwing error
emitting error
  ✗  handles rejections
  | Error: error
  |     at reduce (/test/fixture/stream-errors.js:7:11)
  |     at <anonymous>

test/fixture/stream-errors.js > handles unhandled rejections
  Error: error
      at reduce (/test/fixture/stream-errors.js:7:11)
      at <anonymous>

test/fixture/stream-errors.js > handles rejections
  Error: error
      at reduce (/test/fixture/stream-errors.js:7:11)
      at <anonymous>

🦅  Executed 2 tests: 2 errors.
/**/