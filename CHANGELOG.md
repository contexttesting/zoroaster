<a name="0.4.4"></a>
## [0.4.4](https://github.com/Sobesednik/zoroaster/compare/v0.4.3...v0.4.4) (14 May 2017) 

- [bugfix] destroy context after test timeout, specific timeout errors for `_evaluateContext`,
`test.run` and `context._destroy()` [7dec23f](https://github.com/Sobesednik/zoroaster/commit/7dec23f)
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
