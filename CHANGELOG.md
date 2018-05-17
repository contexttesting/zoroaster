## 17 May 2018

<a name="2.0.0"></a>
### [1.1.0](https://github.com/artdecocode/zoroaster/compare/v1.1.0...v2.0.0)

- [ecma] update to modules syntax
- [repository] organise files better
- [feature] print default test suite without extra `default` indentation
- [feature] strip `.js` at the end of test suite directory names
- [feature] export `ok` for assertions

## 4 May 2018

<a name="1.1.0"></a>
### [1.1.0](https://github.com/artdecocode/zoroaster/compare/v1.0.0...v1.1.0)

- [feature] pass `--babel` to include `@babel/register`
- [feature] multiple contexts

## 16 March 2018

<a name="1.0.0"></a>
### [1.0.0](https://github.com/Sobesednik/zoroaster/compare/v1.0.0-beta.2...v1.0.0)

- **breaking Node < 8.6** Version 1 🎆
- readme adjustments, simpler example and emoji 🦅 .

<a name="1.0.0-beta.2"></a>
### [1.0.0-beta.2](https://github.com/Sobesednik/zoroaster/compare/v0.5.3...v1.0.0-beta.2) (15 March 2018)

- update to using ES7 syntax and provide `zoroaster-es5` support.

<a name="0.5.3"></a>
### [0.5.3](https://github.com/Sobesednik/zoroaster/compare/v0.5.2...v0.5.3) (2 January 2018)

- [dependency] update `assert-throws` to `1.3.0` (return error).

<a name="0.5.2"></a>
### [0.5.2](https://github.com/Sobesednik/zoroaster/compare/v0.5.1...v0.5.2) (1 January 2018)

- [dependency] update `assert-throws` to `1.2.0` (strict equal, jsdoc, message regex).

<a name="0.5.1"></a>
### [0.5.1](https://github.com/Sobesednik/zoroaster/compare/v0.5.0...v0.5.1) (1 January 2018)

- [dependency] update `assert-throws` to `1.1.0` (code).

<a name="0.5.0"></a>
### [0.5.0](https://github.com/Sobesednik/zoroaster/compare/v0.4.6...v0.5.0) (31 December 2017)

- [feature] `zoroaster/assert` module with common assertion methods

<a name="0.4.6"></a>
### [0.4.6](https://github.com/Sobesednik/zoroaster/compare/v0.4.5...v0.4.6) (28 May 2017)

- [bugfix] run main function on Windows ([eafc0da](https://github.com/Sobesednik/zoroaster/commit/eafc0da))

<a name="0.4.5"></a>
### [0.4.5](https://github.com/Sobesednik/zoroaster/compare/v0.4.4...v0.4.5) (25 May 2017)

- [feature] export main function, which spawns `zoroaster` binary ([0b81c9b](https://github.com/Sobesednik/zoroaster/commit/0b81c9b))

<a name="0.4.4"></a>
### [0.4.4](https://github.com/Sobesednik/zoroaster/compare/v0.4.3...v0.4.4) (14 May 2017)

- [bugfix] destroy context after test timeout, specific timeout errors for `_evaluateContext`,
`test.run` and `context._destroy()` ([7dec23f](https://github.com/Sobesednik/zoroaster/commit/7dec23f))
- [code] use [promto](https://github.com/Sobesednik/promto) to create promises with timeout

## 0.4.2, 0.4.3 (10 May 2017)

- [feature] context accepts `_destroy` method
- [bugfix] catch runtime errors while evaluating context

## 0.4.1 (7 May 2017)

 - [feature] context can be a function, which returns a promise

## 0.4.0 (1 May 2017)

- [feature] Read context as a property of a test suite.

## 0.3.1 (19 April 2017)

- [code] Use `catchment`.
- [test] Add integration test.

## 0.3.0 (18 April 2017)

- [feature] Implement test and test suite context.
- [bugfix] Show output with errors correctly.
- [repo] Add changelog.
