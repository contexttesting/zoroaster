# Test Driven Development

``Test driven development`` is a software development methodology which enforces writing tests
before implementing a feature. Despite the fact that it sounds harsh on developers not to let them
start working on their product straight away, it brings such advantages as _code quality_ and allows
to build up the _test coverage_ in step with source code. Instead of letting tests pile up for
future, in ``TDD`` a team of developers can be confident that each new introduced change has been
properly tested.

For example, you have made a package to take a screenshot, after which your project structure is
similar to this:

```fs
- src
- src/index.js
- test
- test/spec
- test/spec/index.js
```

Now, you want to make it record a video. Usually, people would be tended to the `src` folder,
and either modify `index.js`, or create a new file `record-video.js`. In ``TDD``, however, the rule
is to go to `test` directory, make a new file for the test suite of the new feature and write
a basic test (which will fail at first). When test is ready, the source code for the logic of the
feature can be written. For example, we create a new *test suite* first:

```javascript
// test/spec/record-video.js
const capturescreen = require('capturescreen')

const recordVideoTestSuite = {
    'should be able to record a video': () => {
        return capturescreen.video(1500) // record 1.5s video
    },
}

module.exports = recordVideoTestSuite
```

Run tests...

```bash
$ zoroaster test/spec/
```

And get an error in the result:

```fs
test/spec/record-video.js
  ✗  should be able to record a video
  | TypeError: capturescreen.video is not a function
  |     at should be able to record a video (/Users/user/zoroaster.co.uk/test/spec/record-video.js:5:30)

test/spec/record-video.js > should be able to record a video
  TypeError: capturescreen.video is not a function
      at should be able to record a video (/Users/user/zoroaster.co.uk/test/spec/record-video.js:5:30)

Executed 1 tests: 1 error.
```

## Implementing a feature

When the first test is written, a video-recording feature can be added. We create a new file
in the `src` directory:

```js
// src/record-video.js
function recordVideo(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration) // pretend to record a video
    })
}

module.exports = recordVideo
```

Use it in our package's main function:

```js
// src/index.js
const recordVideo = require('./record-video')

function captureScreen() {
    return Promise.resolve('Screen captured') // pretend to capture a screen
}

captureScreen.video = recordVideo

module.exports = captureScreen
```

When the logic is implemented, we run tests again:

```bash
$ zoroaster test/spec/
```

And hooray, the test passed:

```fs
 test/spec
   record-video.js
    ✓  should be able to record a video

Executed 1 tests.
```

By progressively writing tests and adding source code which makes them pass, the software
automatically acquires new specification in form of tests. ``Test-Driven Development`` helps
to develop discipline in consistently writing tests to make sure that the product meets
quality expectations. It is very easy to write a lot of code which works _now_, but is
unmaintainable in the long-run due to the lack of test coverage. Therefore, if having tests is
necessary for any software project, why keep it to the end and not begin by writing them?

## Zoroaster's watch mode

`zoroaster` can be started in _watch_ mode. This means that tests are re-run automatically when
a change is made to any source or test files.

```bash
$ zoroaster test/spec --watch
```

If we repeated the example above with this feature, we would see the following output:

```fs
 test/spec
   record-video.js
    ✗  should be able to record a video
    | TypeError: capturescreen.video is not a function
    |     at should be able to record a video (/Users/user/zoroaster.co.uk/test/spec/record-video.js:5:30)

test/spec > record-video.js > should be able to record a video
  TypeError: capturescreen.video is not a function
      at should be able to record a video (/Users/user/zoroaster.co.uk/test/spec/record-video.js:5:30)

Executed 1 tests: 1 error.

 test/spec
   record-video.js
    ✓  should be able to record a video

Executed 1 tests.
```

Having tests re-run automatically saves a lot of developer's time. It facilitates
``test-driven development`` and allows her to focus on tests and not be interrupted by constant
necessity to execute a test command manually.

### Mocha watch mode

[_mocha_](https://mochajs.org/) also supports watch mode: `-w` or `--watch` flag will make
_mocha_ re-run tests for you.
