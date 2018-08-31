
### Testing a Directory

If a path to a folder is passed as an argument, it will be tested recursively.

```sh
zoroaster test/spec
```

### Testing Files

If a single or multiple file paths are passed, they are all tested.

```sh
zoroaster test/spec/lib/index.js
```

### `--watch`, `-w`: Watch Files for Changes

To watch files for changes, use `--watch` (or `-w`) flag, e.g.,

```sh
zoroaster test/spec --watch
zoroaster test/spec -w
```

### Timeout

The default timeout is `2000ms`. At the moment, only global timeout can be set with the `ZOROASTER_TIMEOUT` environment variable, e.g., `ZOROASTER_TIMEOUT=5000 zoroaster test`

### `--babel`, `-b`: `require(@babel/register)`

If you want to use `@babel/register` in your tests, just pass `--babel` (or `-b`) flag to the CI. It will make a call to require `@babel/register`, so that it must be installed as a dependency in your project, because it's not specified as `zoroaster`'s dependency.

```sh
zoroaster test/spec --babel
zoroaster test/spec -b
```

When ES modules syntax (`import foo from 'foo'`) is needed (in other words, always), the following `.babelrc` pattern needs to be used:

```json
{
  "plugins": [
    "@babel/plugin-syntax-object-rest-spread",
    "@babel/plugin-transform-modules-commonjs"
  ]
}
```

With the following dev dependencies installed:

```fs
yarn add -E -D \
@babel/core \
@babel/register \
@babel/plugin-syntax-object-rest-spread \
@babel/plugin-transform-modules-commonjs \
```

When building the project, you're probably using `@babel/cli` as well.

### package.json

To be able to run `yarn test`, specify the test script in the `package.json` as follows:

```json
{
  "name": "test-package",
  "scripts": {
    "test": "zoroaster test/spec"

  }
}
```

Additional shorter scripts for `yarn` can be specified (`-b` is to require `@babel/register`)

```json
{
  "scripts": {
    "t": "zoroaster -b",
    "tw": "zoroaster -b -w",
    "test": "yarn t test/spec",
    "test-watch": "yarn test -w",
  }
}
```