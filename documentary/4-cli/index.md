## CLI

This section describes how to use _Zoroaster_ from the command-line interface. If it was installed globally, the `zoroaster` command could be used. For locally installed _Zoroaster_, the `yarn` or `npm run` commands are preferred with scripts added to the [`package.json`](#packagejson).

When the path passed is a directory, all test suites it contains will be constructed recursively and executed. Multiple paths can be passed.

```sh
zoroaster test/spec
yarn t test/spec test/mask
```

When the path is a file, it is made into a single test suite and run. Multiple files could also be given.

```sh
zoroaster test/spec/lib.js
yarn t test/spec/lib.js test/mask/lib.js
```

### Reporter & `default`

The reporter will print names of each test, however there are some specifics to how test suite names are printed:

- Whenever a file export the default test suite, the name of the test suite will be displayed as the name of the file. The names of files are printed without the `.js` or `.jsx` extensions. Any named exports will appear under the name of the file.
- If a file is called `default.js` in a directory, the name of the test suite will be the name of the directory, and not `default`. This means that any test suite that is named `default` will have its tests reported under its parent name.
- If there is a directory which contains a `default.js`, and a file with the same name as the directory (but with an extension), the tests in both will be merged under the same test suite.

_For example, with the following directory structure:_

%TREE example/reporting%

_And the test suites exported in the way shown below:_

%FORK-markdown example/reporting-snapshot%

_The reporter will produce the following output:_

%FORK-fs src/bin/zoroaster example/reporting -a%

%~ width="15"%