## Persistent Context

A persistent context is evaluated once for the whole test suite, i.e., it will start once prior to tests. It by default has _5000ms_ to start after which the whole test suite will fail. Each persistent context will go first in the list of contexts obtained via test arguments, before non-persistent contexts.

_With the following persistent context:_
%EXAMPLE: example/Zoroaster/test/context/persistent, ./_cdp => chrome-remote-interface%

_The tests can use the context testing API:_
%EXAMPLE: example/Zoroaster/test/spec/persistent-context, ../../../../assert => zoroaster/assert%

%FORK src/bin/zoroaster example/Zoroaster/test/spec/persistent-context.js%

A persistent context can implement the static getter `_timeout` to specify how much time it has to start-up. Otherwise, the `_init` and `_destroy` have 5 seconds to complete.

For an example, see how `exif2css` uses persistent contexts to [setup a web-server](https://github.com/demimonde/exif2css/blob/master/test/context/index.jsx) to serve images with different EXIF orientations under different routes, and [communicates](https://github.com/dpck/chrome/blob/master/src/index.js#L72) with a headless Chrome via [Chrome Context](https://github.com/dpck/chrome) to take screenshots: https://github.com/demimonde/exif2css/blob/master/test/mask/default.js#L49.

%~%