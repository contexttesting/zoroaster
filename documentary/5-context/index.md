## Context

A context is unique to each test. When added as a `context` property to a test suite, it can be accessed from test function's first argument. If there are multiple contexts, they can be accessed in subsequent arguments.

<!-- Test suite context cannot be updated from within tests (only its state when using a function). -->