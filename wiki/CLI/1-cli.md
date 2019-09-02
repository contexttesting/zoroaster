## `--watch`, `-w`: Watch Files for Changes

To watch files for changes, use `--watch` (or `-w`) flag, e.g.,

```sh
zoroaster test/spec --watch
zoroaster test/spec -w
```

After a change to a file happens, _Zoroaster_ will clear all dependencies and run tests again. It will not, however, clear the `node_modules` dependencies, so that if another package that was used in the project previously was updated to a newer version, the test runner will have to be restarted.

%~ width="25"%

## `--timeout`, `-t`: Timeout

Sets the global timeout for each test in ms. The default timeout is `2000ms`.

%~ width="25"%

## `--alamode`, `-a`: `require('alamode)()`

[ÀLaMode](https://github.com/a-la/alamode) is a Regex-Based transpiler that allows to write `import` and `export` statements. It will transpile tests and source files on-the-fly when this option is used.

```sh
zoroaster test/spec -a
```

### `.alamoderc.json`

One of the advantages of using _ÀLaMode_ is that it can substitute paths to imported modules according to the configuration found in the `.alamoderc.json` file in the project directory. For example, if it is required to test the `build` directory instead of the `src` directory, the following configuration can be used:

```json5
{
  "env": {
    "test-build": {
      "import": {
        "replacement": {
          "from": "^((../)+)src",
          "to": "$1build"
        }
      }
    }
  }
}
```

This will make _Zoroaster_ import source code from the `build` directory when the `ALAMODE_ENV` is set to `test-build` (also see [`package.json`](#packagejson) for a quick script which allows to do that). This is extremely useful to check that the code transpiled for publishing passes same tests as the source code.

%~%

## `--babel`, `-b`: `require(@babel/register)`

To use `@babel/register` in tests, the `--babel` (or `-b`) flag can be passed to the CLI. It will make a call to require `@babel/register`, therefore it must be installed as a dependency in the project, because it's not specified as _Zoroaster_'s dependency.

```sh
zoroaster test/spec --babel
zoroaster test/spec -b
```

For example, when the _ES6_ modules syntax (`import package from 'package'`) is needed, the following `.babelrc` pattern needs to be used:

```json
{
  "plugins": [
    "@babel/plugin-syntax-object-rest-spread",
    "@babel/plugin-transform-modules-commonjs"
  ]
}
```

with the following _dev_ dependencies installed:

```fs
yarn add -E -D \
@babel/core \
@babel/register \
@babel/plugin-syntax-object-rest-spread \
@babel/plugin-transform-modules-commonjs \
```

However, the above set-up can be easily achieved with _ÀLaMode_ which has much less dependencies than `Babel` and is faster. This option therefore should be used for cases when more advanced transforms need to be added.

%~%

## `--snapshot`, `-s`

Sets the root snapshot directory, with `test/snapshot` as the default. For example, if the test from `test/spec/test-suite.js` returned some data, the snapshot would be saved in `test/snapshot/test/spec/test-suite/the-name-of-the-test.txt` file (see snapshot root below).

## `--snapshotRoot`, `-r`

When generating snapshots, ignores the initial part of the path that matched the root. The default value is `test/spec,test/mask`, so that the snapshot from the example above would actually be saved at `test/snapshot/test-suite/the-name-of-the-test.txt`.

%~%

## package.json

To be able to run tests from the project directory, it is advised to use `package.json` scripts. There is the main `test` script, and additional shorter scripts for `yarn` and `npm` that make it easy to run tests.

```table
[
  ["Command", "Meaning"],
  ["t", "Command which could be used to point to the exact file, e.g., `yarn t test/spec/lib.js`."],
  ["test", "Run all tests found in the `spec` and `mask` directories."],
  ["mask", "Run just `mask` tests."],
  ["spec", "Run only `spec` tests."],
  ["test-build", "When a project is built into `build`, and `ALAMODE_ENV` is configured in [`.alamoderc.json`](#alamodercjson), this allows to substitute all paths to source files in the `src` directory to paths in the `build` directory."]
]
```

```json5
{
  "scripts": {
    "t": "zoroaster -a",
    "test": "yarn t test/spec test/mask",
    "mask": "yarn t test/mask",
    "spec": "yarn t test/spec",
    "test-build": "ALAMODE_ENV=test-build yarn test",
  }
}
```

%~%