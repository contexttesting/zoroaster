## Class Context

A context can and most often will be a class, and to initialise it, the _`_init`_ function will be called by the test runner if present. All methods in the context **will be bound** to the instance of a context for each tests, therefore it's possible to use destructuring and still have methods having access to `this` and thus the state of the context. **Getters** are also bound to the context and the variables initialised using the destructuring of the context will take their value from its initial state. Finally, the _`_destroy`_ method will ensure the tear-down of the testing context at the end of the test.

_With the following simple context:_
%EXAMPLE: example/Zoroaster/test/context%

_The tests can use the context testing API:_
%EXAMPLE: example/Zoroaster/test/spec/async-context%

%FORK src/bin/zoroaster example/Zoroaster/test/spec/async-context.js%

%~%