## Context

A context is unique to each test. When added as the `context` property to a test suite, it can be accessed from the test function's first argument. If there are multiple contexts, they can be accessed in subsequent arguments.

> **Only contexts** specified in the test functions' arguments will be evaluated. For example, if the test suite contains 2 contexts, `A` and `B`, the test `test caseA(A, B)` will have both contexts evaluated and available to it, `testCaseB(A)` will only have context `A` evaluated, and `testCase()` will not lead to evaluation of any contexts. This means that functions with variable lengths like `test(...contexts)` will not have any contexts evaluated for them. This is done to avoid unnecessary work when some tests in a test suite might need access to all contexts, whereas others don't.

<!-- Test suite context cannot be updated from within tests (only its state when using a function). -->