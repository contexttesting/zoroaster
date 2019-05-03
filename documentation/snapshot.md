# Snapshots

If a test returned some data, it will be saved in snapshots' directory in a file that corresponds to the name of the test for which it was taken. The default location of snapshots is `test/snapshot/...`, and `test/spec` with `test/mask` do not participate in the path formation.

```js
import { asyncSoftware } from './src'

const TestSuite = {
  async 'supports snapshots'() {
    const res = await asyncSoftware('string')
    return res
  },
  async 'fails if snapshot is different'() {
    const res = await asyncSoftware('string')
    return res
  },
  async 'fails if snapshot exists'() {
    await asyncSoftware('string')
    return undefined
  },
  async 'fails if snapshot is of different type'() {
    await asyncSoftware('string')
    return { hello: 'world' }
  },
}

export default TestSuite
```

![Zoroaster Snapshot Example](doc/snapshot.gif)

- [Service Context](#service-context)
  * [Snapshot Extension](#snapshot-extension)
  * [Snapshot Source](#snapshot-source)
  * [Serialise](#serialise)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true" width="25"></a></p>

## Service Context

The _Service Context_ is a special type of context that allows to access APIs to control how snapshots are saved.

### Snapshot Extension

It is possible to change the file type with which the snapshot will be saved. This can be useful for visual inspection of the snapshot, for example if a program under test produces XML output, it should be saved with `xml` file extension so that it is easy to see its structure when opening the file in the IDE. To achieve that, a service context is used.

The service context can be used in 2 ways, however they both require the test suite to import the _Zoroaster_ context `zoroaster` package:

```js
import Zoroaster from 'zoroaster'
```

1. The extension of the whole test suite can be set by specifying a contexts which **extends** _Zoroaster_ service context, and implements the `get snapshotExtension` getter. Then it can be attached to the test suite in the same way as other contexts, that is by specifying it in the `context` property:
    ```js
    class XmlSnapshot extends Zoroaster {
      static get snapshotExtension() { return 'xml' }
    }

    /** @type {Object.<string, (c: Context)>} */
    const T = {
      context: [Context, XmlSnapshot],
      async 'generates XML from the JS file'({ path }) {
        const xml = generateXML(path)
        return xml
      },
    }
    ```

2. The second way to use the service context is for individual tests, but the _Zoroaster_ context does not have to be extended. It works by accessing the `snapshotExtension` method from the test itself:
    ```js
    /** @type {Object.<string, (c: Context, z: Zoroaster)>} */
    const T = {
      context: [Context, Zoroaster],
      async 'generates XML from the JS file'({ path }, { snapshotExtension }) {
        const xml = generateXML(path)
        snapshotExtension('xml')
        return xml
      },
    }
    ```

### Snapshot Source

If the test repeats the snapshot of another test in the test suite, it can point to the name of this test with the `snapshotSource` method. It accepts two arguments: first, the name of the test in the test suite that should be used to query the snapshot for, and second, optional, is the snapshot extension, if such extension was set with the `snapshotExtension` method in the test (because otherwise the test runner cannot know that a different extension is required, unless the extended service context is used that implements the `snapshotExtension` getter).

```js
const T = {
  context: [Zoroaster, TempContext],
  async 'generates correct markdown'({ snapshotExtension }) {
    const markdown = await generateMarkdown()
    snapshotExtension('md')
    return markdown
  },
  async 'generates correct markdown and saves it to a file'(
    { snapshotSource }, { read, resolve },
  ) {
    const output = resolve('output.md')
    await generateMarkdown(output)
    const s = await read('output.md')
    snapshotSource('generates correct markdown', 'md')
    return markdown
  },
}
```

### Serialise

Whenever the snapshot does not match the output of the test, or its type (strings are saved as `txt` files and objects as `json` files), an error will be thrown. To enable updating snapshots during the test run, the `-i` or `--interactive` option can be passed to _Zoroaster_ test runner. Currently, only JSON serialisation is supported, therefore there might be errors due to the `JSON.stringify` method omitting undefined properties and dates.

The `static serialise` method can be overridden to provide the serialisation strategy for tests. The _deepEqual_ method from the `@zoroaster/assert` package will compare objects for deep strict equality, so that when an instance of a class returned by the test, the test will fail because the instance will be of its type, whereas the expected value will be of type _Object_. To solve that, the `serialise` method can be implemented.

```js
import Zoroaster from 'zoroaster'
import Example from './Example'

export const withSerialisation = {
  context: class extends Zoroaster {
    /** @param {Example} example **/
    static serialise(example) {
      // prevent comparison of a date object and JSON string
      example.created = example.created.toGMTString()
      // prevent omitting of undefined in the JSON snapshot
      Object.keys(example).forEach((key) => {
        const val = example[key]
        example[key] = val === undefined ? 'undefined' : val
      })
      return { ...example }
    }
  },
  async 'serialises dates'() {
    const instance = new Example('test', true)
    return instance
  },
  async 'records missing properties'() {
    const instance = new Example()
    return instance
  },
}

export const withoutSerialisation = {
  async 'serialises dates'() {
    const instance = new Example('test', true)
    return instance
  },
  async 'records missing properties'() {
    const instance = new Example()
    return instance
  },
}
```

<details>
<summary>Show Output</summary>

```
example/serialise/spec.js
   withSerialisation
    ✓  serialises dates
    ✓  records missing properties
   withoutSerialisation
    ✗  serialises dates
    | AssertionError [ERR_ASSERTION]: Example {
    |   name: 'test',
    |   isExample: true,
    |   created: 2019-05-31T21:00:00.000Z } deepStrictEqual { name: 'test',
    |   isExample: true,
    |   created: '2019-05-31T21:00:00.000Z' }
    | - Object
    | + Example
    ✗  records missing properties
    | AssertionError [ERR_ASSERTION]: Example {
    |   name: undefined,
    |   isExample: undefined,
    |   created: 2019-05-31T21:00:00.000Z } deepStrictEqual { created: '2019-05-31T21:00:00.000Z' }
    | - Object
    | + Example

example/serialise/spec.js > withoutSerialisation > serialises dates
  AssertionError [ERR_ASSERTION]: Example {
    name: 'test',
    isExample: true,
    created: 2019-05-31T21:00:00.000Z } deepStrictEqual { name: 'test',
    isExample: true,
    created: '2019-05-31T21:00:00.000Z' }
  - Object
  + Example

example/serialise/spec.js > withoutSerialisation > records missing properties
  AssertionError [ERR_ASSERTION]: Example {
    name: undefined,
    isExample: undefined,
    created: 2019-05-31T21:00:00.000Z } deepStrictEqual { created: '2019-05-31T21:00:00.000Z' }
  - Object
  + Example

🦅  Executed 4 tests: 2 errors.
```
</details>


<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>