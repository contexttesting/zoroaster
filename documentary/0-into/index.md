## Do You Want Testing Framework That...

_Zoroaster_ is the most modern _Node.JS_ testing framework that addresses the full spectrum of developer's needs and innovates the way quality assurance is done on NPM packages.

### Is Very Small And Super Fast

_Zoroaster_ does not have many dependencies and does not install Babel, yet it is able to run tests with `import/export` statements. Having less dependencies in `node_modules` means that any new dependencies needed for the project will be installed immediately without having to wait for the linking to complete, and new projects can be started in seconds, without having to resolve all dependencies for a testing framework. Furthermore, _Zoroaster_ only loads 3 JavaScript files, that is itself (1000 lines of code optimised with _Google Closure Compiler_), the interface for a service context (34 lines) and the _RegExp-based_ algorithm to transpile `import/export` statements (when the `-a` option is passed) which is also optimised. The tests will start and run in milliseconds.

```table
[
  ["Framework", "Fetching", "Linking", "Disk", "Node_Module Dirs", "yarn.lock Lines", "Downloads"],
  ["Jest", "485", "7407", "59.75MB", "420", "3614", "3,713,921"],
  ["Mocha", "115", "2016", "12.17MB", "103", "785", "2,523,262"],
  ["Jasmine", "13", "106", "896KB", "13", "88", "1,040,918"],
  ["Tape", "33", "506", "2.85MB", "33", "228", "411,483"],
  ["Ava", "462", "6605", "34.34MB", "378", "3281", "122,355"],
  ["Tap", "469", "7905", "94.12MB", "407", "3375", "101,879"],
  ["Zoroaster", "4", "31", "448KB", "3", "27", "1096"]
]
```

Compared to the other frameworks, _Jasmine_ test runner is the next most-lightweight one, followed by modest _Tape_ and _Mocha_, however they don't support snapshots and don't work with ES6 modules out of the box. However, there is no browser version of `zoroaster` at the moment.

### Allows To Write Set-Ups And Tear-Downs In Separate Files

One of the disadvantages of conventional testing frameworks is that they force developers to put setup and tear-down logic directly in test suites, which prevents management of tests by files. Using local scopes to store test states, limited access to the JSDoc and breaking of the DRY (don't repeat yourself) principle makes testing inconvenient. _Zoroaster_ is the first **Context-Testing** framework that approaches the problem from the completely different angle: there is no setups and teardowns on tests, there is a context, which can be initialised and destroyed. Contexts are kept in separate files and can be written as classes, which greatly improves developer experience and allows to "test the tests" and take the quality assurance to the next level. Unlike before and after eachs, test contexts can not only be shared by test suites in different files, but can also be published and reused across projects.

<p align="center">
  <img src="doc/z.gif" alt="Zoroaster Test Example With JSDoc Context API">
</p>

### Supports Masks To Only Write Inputs/Outputs

A test is a function which passes inputs to a method and compares the output to the expected one. A single method can receive 1000s different inputs, including edge cases. Normally, each input would be added as a new test, where the same logic is repeated to run the method. _Zoroaster_ eliminates the need to repeat the same code over and over again, and allows to focus on only adding new inputs to the existing test base to cover larger search field of the method under test. The routine to create tests, or test constructor is called a mask and is written in JavaScript, whereas the test input/outputs and any additional parameters can be written in plain text, such as `markdown`. Mask testing in _Zoroaster_ is highly configurable, and combined with contexts provides the quickest, easiest and most flexible way to complete test coverage. Testing streams is also possible with masks &mdash; it is only required to write the `getTransform` or `getReadable` methods, and the output will be automatically collected and compared against the expected mask result.

<table>
<tr><th>Mask</th><th>Mask Result</th></tr>
<tr><td><img src="doc/why/mask1.gif" alt="The JS Mask Setup Function"/>
</td><td><img src="doc/why/mask-result2.gif" alt="The Markdown Mask Result"/>
</td></tr>
<tr><td><md2html>

The mask uses the `makeTestSuite` method to create a test suite with multiple tests which perform the same logic, but for different inputs. Here, we use the `getTransform` property to create a stream which will find a certain marker in the code which points to the location of types.xml file, and read that file to embed JSDoc documentation. We also make use of the TempContext which writes the `types` property of the mask into a temp file.</md2html></td>
<td><md2html>

After the mask is setup once, we can add as many tests as we want in the mask result file easily. Because the `getTransform` property was specified, the transform stream returned by it will be ended with the result's input, and the output collected and compared against the `expected` property of the mask. We use a custom `propStart` and `propEnd` regular expressions that split properties by `/*@` (start) and `/*@*/` (end), because the default is `/*` (start) and `/**/` (end) which would interfere with generated JSDoc.</md2html></td>
</tr>
</table>

### Was Made To Test Forks

Creating CLI Node.JS applications is fun. Testing them is not so much, because there is always the need to create new child processes, manage their state, interact with them somehow and then assert on inputs and outputs. In addition to simple mask testing, _Zoroaster_ has a special configuration object that can be passed to the mask called `fork`, where it is possible to specify what module to fork, what options to pass to it and even what inputs should be entered into its `stdin` when a value matching a `RegExp` comes up. The arguments are taken from the mask result ("the plain file") input, and compared to `stdout` and `stderr` properties of the result. Now all the developers have to do is write their arguments, configure options, possibly use test context (such as `temp-context` to create and delete temp directories and get their snapshots by the end of the test) and supply the expected output of the CLI program.

### Supports Snapshots And Streams

Although some people don't approve of snapshot testing, it is an extremely useful tool for regression testing. There is no difference between writing asserts within specs, specifying them in masks, or returning them in snapshots, except that in the first case it takes a lot of manual labour, in the second case they are more visible, and in the third case they only require a second to write, but provide the robust mechanism against unexpected changes in the future, and thus are a good regression testing strategy. There is no additional methods to be called to create a snapshot, tests only need to return a value. Moreover, snapshots' file extension can be specified so that they can be naturally inspected with syntax highlighting in the IDE (e.g., for markdown files), and custom serialisation algorithms can be implemented. If a test returns a stream, its data will also be collected prior to being tested against a snapshot.

---

These are the main features of _Zoroaster_ &mdash; the testing framework made by professional _Node.JS_ developers made for other professional _Node.JS_ developers and quality assurance experts. Unfortunately, there is no coverage tool at the moment, but we hope to add one in the near future. Nonetheless, the test contexts, mask and fork testing and its small size and performance will make it the testing framework of choice for developers who are tired of old paradigms.

%~%