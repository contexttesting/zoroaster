### Multiple Contexts

It is possible to specify multiple contexts by passing an array to the `context` property. Oftentimes, the package's main context will contain references to fixtures, or provide methods to resolve paths to fixtures, so that it is easy to access them across tests. Next, another context can be added in the array to enrich the testing API. In the following example, the first context is used to get the path of a fixture file, and the second, _TempContext_ is used to get the location of the temporary output, as well as to read that output later.

%EXAMPLE: example/Zoroaster/test/spec/multiple-context%

> **Only contexts** specified in the test functions' arguments will be evaluated. For example, if the test suite contains 2 contexts, `A` and `B`, the test `test caseA(A, B)` will have both contexts evaluated and available to it, `testCaseB(A)` will only have context `A` evaluated, and `testCase()` will not lead to evaluation of any contexts. This means that functions with variable lengths like `test(...contexts)` will not have any contexts evaluated for them. This is done to avoid unnecessary work when some tests in a test suite might need access to all contexts, whereas others don't.

%~ width="25"%