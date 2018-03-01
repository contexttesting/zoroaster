# Test File Organisation for Zoroaster

Organising your test files has never been simpler. Create a `test` directory in your project root,
in it place `context`, `spec`, `fixtures` and `temp` directories (optionally, if you work with
_io_). For example, your project file structure might look like this:

```fs
- CHANGELOG.md
- LICENSE
- package.json
- README.md
- src
- src/index.js
- test
- test/context
- test/context/ScreenCapture.js
- test/fixtures
- test/fixtures/screenshot.png
- test/spec
- test/spec/index.js
- test/spec/record-video.js
```

All testing functions which can be required by both test files should be exported in _ScreenCapture_
context. This makes test independent of the scope of `js` files, making it easy to create new
test suites in new files.
