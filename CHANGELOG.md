## 2 September 2019

### [4.1.2](https://github.com/contexttesting/zoroaster/compare/v4.1.1-alpha...v4.1.2)

- [deps] Upgrade deps w/ _ÀLaMode 3_.
- [feature] Allow to focus with `$`.
- [docs] Create Wiki.

## 3 May 2019

### [4.1.1-alpha](https://github.com/contexttesting/zoroaster/compare/v4.1.0-alpha...v4.1.1-alpha)

- [package] Remove source maps until VSCode supports proper debugging [#73197](https://github.com/Microsoft/vscode/issues/73197).

## 2 May 2019

### [4.1.0-alpha](https://github.com/contexttesting/zoroaster/compare/v4.0.0-alpha...v4.1.0-alpha)

- [fix] Fix the watch mode with service context.
- [fix] Allow snapshots to focus on test suites.
- [fix] Catch unhandled async errors when streams are returned (close [#63](https://github.com/contexttesting/zoroaster/issues/63)).
- [feature] Allow to serialise snapshots.

### [4.0.0-alpha](https://github.com/contexttesting/zoroaster/compare/v3.13.0...v4.0.0-alpha)

- [build] Build the package with _Depack_, reduce dependencies to 3.
- [api] Change `@zoroaster/mask` API to access the inputs only via the `this` keyword.
- [deps] Move assertions to the assertion library.

## 24 April 2019

### [3.13.0](https://github.com/contexttesting/zoroaster/compare/v3.12.0...v3.13.0)

- [deps] Install _ÀLaMode@v2_; use _Argufy_ to create arguments list.

## 23 April 2019

### [3.12.0](https://github.com/contexttesting/zoroaster/compare/v3.11.6...v3.12.0)

- [feature] Update masks' results in interactive mode.

## 18 April 2019

### [3.11.6](https://github.com/contexttesting/zoroaster/compare/v3.11.5...v3.11.6)

- [feature] Add `preamble` in masks.

## 11 April 2019

### [3.11.5](https://github.com/contexttesting/zoroaster/compare/v3.11.4...v3.11.5)

- [feature] Implement `propsStartRe` and `propEndRe` in masks.
- [deps] Update deps (remove old `wrote` from _SnapshotContext_).

## 3 April 2019

### [3.11.4](https://github.com/contexttesting/zoroaster/compare/v3.11.3...v3.11.4)

- [deps] Unfix some deps.

### [3.11.3](https://github.com/contexttesting/zoroaster/compare/v3.11.2...v3.11.3)

- [deps] Update deps.

## 28 March 2019

### [3.11.2](https://github.com/contexttesting/zoroaster/compare/v3.11.1...v3.11.2)

- [fix] Catch global errors, errors in persistent context evaluation and notify of errors in persistent context destroy.

## 27 March 2019

### [3.11.1](https://github.com/contexttesting/zoroaster/compare/v3.11.0...v3.11.1)

- [fix] Merge test suites when a file has the same name as a directory.
- [fix] Remove `trim` from _SnapshotContext_.
- [doc] Document reporting and `default` meaning, some fixes 4 persistent context.

## 27 March 2019

### [3.11.0](https://github.com/contexttesting/zoroaster/compare/v3.10.0...v3.11.0)

- [feature] Focus on masks.
- [feature] Service Context for better control of snapshots.
- [feature] Evaluate only contexts required for the test.
- [doc] Documentation improvements and fixes.

## 21 March 2019

### [3.10.0](https://github.com/contexttesting/zoroaster/compare/v3.9.1...v3.10.0)

- [feature] Interactive update of snapshots.

## 20 March 2019

### [3.9.1](https://github.com/contexttesting/zoroaster/compare/v3.9.0...v3.9.1)

- [fix] Evaluate multiple persistent contexts.
- [fix] Async `assertResults` in mask and pass `this` context props to it.

## 17 March 2019

### [3.9.0](https://github.com/contexttesting/zoroaster/compare/v3.8.5...v3.9.0)

- [feature] Support context-testing out of the box.
- [deps] Update the fork to remove ANSI and add the `preprocess` option.

## 15 March 2019

### [3.8.5](https://github.com/contexttesting/zoroaster/compare/v3.8.4...v3.8.5)

- [deps] Up `@zoroaster/mask` to automatically resolve result paths extensions.

### [3.8.4](https://github.com/contexttesting/zoroaster/compare/v3.8.3...v3.8.4)

- [deps] Move the mask logic to `@zoroaster/mask` and remove file extensions in nested mask results.
- [deps] Update `alamode`.
- [fix] Better error message for a sync error when requiring tests.

## 14 March 2019

### [3.8.3](https://github.com/contexttesting/zoroaster/compare/v3.8.2...v3.8.3)

- [fix] Restore the new lines highlighting in diffs.
- [fix] Focus on the correct test in the mask.
- [fix] Jump to the mask result line with custom test separators.

## 11 March 2019

### [3.8.2](https://github.com/contexttesting/zoroaster/compare/v3.8.1...v3.8.2)

- [deps] Update `alamode` to 1.8.4 to enable overriding of the hooks installed by _Zoroaster_.

## 6 March 2019

### [3.8.1](https://github.com/contexttesting/zoroaster/compare/v3.8.0...v3.8.1)

- [fix] Collapse exports of `default.jsx` test suite into the parent test suite for display (same as `default.js` now).

## 26 February 2019

### [3.8.0](https://github.com/contexttesting/zoroaster/compare/v3.7.3...v3.8.0)

- [feature] Persistent Contexts.

## 22 February 2019

### [3.7.3](https://github.com/contexttesting/zoroaster/compare/v3.7.2...v3.7.3)

- [fix] Attempt to destroy contexts that started to evaluate.

## 19 February 2019

### [3.7.2](https://github.com/contexttesting/zoroaster/compare/v3.7.1...v3.7.2)

- [fix] Ignore the start of the mask result file which does not start with a test heading, e.g.,

```js
import { TextArea, Select, Form } from '../../src'

// returns the correct output
(<Form></Form>)

/* expected */
(<form></form>)
/**/
```

## 18 February 2019

### [3.7.1](https://github.com/contexttesting/zoroaster/compare/v3.7.0...v3.7.1)

- [feature] Pass mask input properties to all mask properties such as `getResults`, `getReadable`, `getTransform`, _etc_.

## 16 February 2019

### [3.7.0](https://github.com/contexttesting/zoroaster/compare/v3.6.7...v3.7.0)

- [feature] Pass mask input properties to `getArgs` and `getOptions` for forking.

## 15 February 2019

### [3.6.7](https://github.com/contexttesting/zoroaster/compare/v3.6.6...v3.6.7)

- [deps] Update Dependencies.

## 29 October 2018

### [3.6.6](https://github.com/contexttesting/zoroaster/compare/v3.6.5...v3.6.5)

- [feature] Export the assertions in the main file.

### [3.6.5](https://github.com/contexttesting/zoroaster/compare/v3.6.4...v3.6.5)

- [dep] Refactor the runner into `@zoroaster/reducer`.

## 24 October 2018

### [3.6.4](https://github.com/contexttesting/zoroaster/compare/v3.6.3...v3.6.4)

- [feature] Parse inputs from the mask properties.

### [3.6.3](https://github.com/contexttesting/zoroaster/compare/v3.6.2...v3.6.3)

- [deps] Refactor mask fork into `@zoroaster/fork`.
- [fix/feature] Include answers in the fork stdout.

## 7 October 2018

### [3.6.2](https://github.com/contexttesting/zoroaster/compare/v3.6.1...v3.6.2)

- [deps] Install and use `forkFeed`.

## 29 September 2018

### [3.6.1](https://github.com/contexttesting/zoroaster/compare/v3.6.0...v3.6.1)

- [fix] Make sure options for fork are always returned; set `execArgv` to `[]` always to enable debugging.
- [build] Remove source maps from build.

### [3.6.0](https://github.com/contexttesting/zoroaster/compare/v3.5.2...v3.6.0)

- [feature] Allow to pass inputs to the `fork` via _ForkConfig_, and log the fork streams.
- [deps] Remove `yarn-s` dep.

## 28 September 2018

### [3.5.2](https://github.com/contexttesting/zoroaster/compare/v3.5.1...v3.5.2)

- [fix] Bind inherited methods by using a Proxy.

## 20 September 2018

### [3.5.1](https://github.com/contexttesting/zoroaster/compare/v3.5.0...v3.5.1)

- [fix] Update `alamode@1.5.1` to import babel-transpiled modules correctly.
- [doc] Document `alamode` usage, improve introductory description.

### [3.5.0](https://github.com/contexttesting/zoroaster/compare/v3.4.1...v3.5.0)

- [feature] Add `forkConfig` option to the mask.

## 17 September 2018

### [3.4.1](https://github.com/contexttesting/zoroaster/compare/v3.4.0...v3.4.1)

- [fix] Allow to pass `async` `getTransform` and `getReadable`.

### [3.4.0](https://github.com/contexttesting/zoroaster/compare/v3.3.0...v3.4.0)

- [feature] Rename `streamResult` to `getTransform` and add `getReadable` to test streams which can be constructed using the `input` property of a mask.
- [feature] Add the `fork` property to the mask factory.
- [fix] Allow `expected` value in the mask to be empty or with a blank line (to test single new lines).

### [3.3.0](https://github.com/contexttesting/zoroaster/compare/v3.2.0...v3.3.0)

- [feature] Implement `streamResult` for masks, allowing to easily test `Transform` streams.

## 15 September 2018

### [3.2.0](https://github.com/contexttesting/zoroaster/compare/v3.1.1...v3.2.0)

- [feature] Allow to split tests in a mask file with a custom regular expression.

## 13 September 2018

### [3.1.2](https://github.com/contexttesting/zoroaster/compare/v3.1.0...v3.1.1), [3.1.1](https://github.com/contexttesting/zoroaster/compare/v3.1.1...v3.1.2)

- [deps] Up deps.

### [3.1.0](https://github.com/contexttesting/zoroaster/compare/v3.0.4...v3.1.0)

- [feature] Allow to construct mask test suites from a directory.
- [deps] Use `@artdeco/clean-stack@1`.

### [3.0.4](https://github.com/contexttesting/zoroaster/compare/v3.0.3...v3.0.4)

- [fix] Allow masks to have new lines in inputs.

## 5 September 2018

### [3.0.3](https://github.com/contexttesting/zoroaster/compare/v3.0.1...v3.0.2)

- [deps] Update `assert-throws` to allow testing any of the error properties, and use function assertions.

## 4 September 2018

### [3.0.2](https://github.com/contexttesting/zoroaster/compare/v3.0.1...v3.0.2)

- [build] `ln -s` the `assert` lib instead of proxying modules.

### [3.0.1](https://github.com/contexttesting/zoroaster/compare/v3.0.0...v3.0.1)

- [deps] Update `clean-stack`, `erotic`, `assert-throws`.
- [fix] Display a missing global error on watch with `beforeExit` listener.

## 1 September 2018

### [3.0.0](https://github.com/contexttesting/zoroaster/compare/v2.4.0...v3.0.0)

- [feature] Focus on !tests and !testsuites.
- [feature] Show usage using `usually`.
- [feature] Parse args with `argufy`.
- [feature] Add the` timeout` argument.
- [breaking] Remove passing tests as paths to files, remove `ZOROASTER_TIMEOUT` in favour of CLI argument.
- [fix] Fix `MaxListenersExceededWarning` warning.
- [doc] Use `documentary` for documentation.

## 22 August 2018

### [2.4.0](https://github.com/contexttesting/zoroaster/compare/v2.3.0...v2.4.0)

- [feature] Require `alamode` for testing of code with `import/export` statements with `-a` flag.

## 18 August 2018

### [2.3.0](https://github.com/contexttesting/zoroaster/compare/v2.2.2...v2.3.0)

- [feature] `makeTestSuite` method to create test suites from masks.

## 16 August 2018

### [2.2.1, 2.2.2](https://github.com/contexttesting/zoroaster/compare/v2.2.0...v2.2.2)

- [fix] Allow to split mask properties without any whitespace.
- [test] Add snapshot test for the mask.

## 15 August 2018

<a name="2.2.0"></a>
### [2.2.0](https://github.com/contexttesting/zoroaster/compare/v2.1.1...v2.2.0)

- [package] Build w/ [`alamode`](https://alamode.cc)
- [feature] Add `getTests` method for mask testing.
- [deps] update `assert-diff@2`, `catchment@3`.

## 24 May 2018

<a name="2.1.1"></a>
### [2.1.1](https://github.com/contexttesting/zoroaster/compare/v2.1.0...v2.1.1)

- [code] switch to class snapshot context, better context in tests
- [readme] documentation for class context as priority over function context

<a name="2.1.0"></a>
### [2.1.0](https://github.com/contexttesting/zoroaster/compare/v2.0.0...v2.1.0)

- [feature] class contexts.
- [feature] `-b` and `-w` shorthand flags

## 17 May 2018

<a name="2.0.0"></a>
### [2.0.0](https://github.com/contexttesting/zoroaster/compare/v1.1.0...v2.0.0)

- [ecma] update to modules syntax
- [repository] organise files better
- [feature] print default test suite without extra `default` indentation
- [feature] strip `.js` at the end of test suite directory names
- [feature] export `ok` for assertions

## 4 May 2018

<a name="1.1.0"></a>
### [1.1.0](https://github.com/contexttesting/zoroaster/compare/v1.0.0...v1.1.0)

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