# Text Context

A test context is an object which is initialised for each test in a test suite. It is destroyed
after the test is run, so that you can better care of garbage-handling, e.g., closing open
connections and removing _temp_ files. To create a test context, write a function and pass it
in the `context` property of a test suite:

```js
console.log(123)
```
