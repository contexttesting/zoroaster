### Class Context

Context can be a class, and to initialise it, `_init` function will be called if present. All methods in the context **will be bound** to the instance of a context for each tests, therefore it's possible to use destructuring and still have methods having access to `this`. Getters and setters are not bound.

_With the following simple context:_
%EXAMPLE: example/Zoroaster/test/context/index.js%

_The tests can use the context testing API:_
%EXAMPLE: example/Zoroaster/test/spec/async-context.js%

%FORK src/bin example/Zoroaster/test/spec/async-context.js%

%~ width="15"%