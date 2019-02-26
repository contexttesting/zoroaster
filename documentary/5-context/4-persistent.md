### Persistent Context

The persistent context is set on the test suite and will start before each test. It by default has 5000ms to start after which the whole test suite will fail. Each persistent context will go first in the list of contexts obtained via test arguments.

_With the following persistent context:_
%EXAMPLE: example/Zoroaster/test/context/persistent.js, ./_cdp => chrome-remote-interface%

_The tests can use the context testing API:_
%EXAMPLE: example/Zoroaster/test/spec/persistent-context.js, ../../../../assert => zoroaster/assert%

%FORK src/bin example/Zoroaster/test/spec/persistent-context.js%

A persistent context can implement the static getter `_timeout` to specify how much time it has to start-up.

%~%