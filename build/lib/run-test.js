const { EOL } = require('os');
let reducer = require('@zoroaster/reducer'); const { runTest } = reducer; if (reducer && reducer.__esModule) reducer = reducer.default;
const { evaluateContext, destroyContexts } = require('@zoroaster/reducer/build/lib');
let promto = require('promto'); if (promto && promto.__esModule) promto = promto.default;
const { TICK, CROSS, indent, filterStack, replaceFilename } = require('.');
const handleSnapshot = require('./snapshot');

/**
 * Run the test.
 * @param {function} [notify] - notify function
 */
async function runTestAndNotify(notify, path, snapshot, snapshotRoot, { name, context, fn, timeout, persistentContext }, interactive) {
  if (notify) notify({
    name,
    type: 'test-start',
  })
  const res = await runTest({
    context,
    persistentContext,
    fn,
    timeout,
  })
  let { error, result } = res
  try {
    await handleSnapshot(result, name, path, snapshot, snapshotRoot, interactive)
  } catch (err) {
    error = err
  }

  if (notify) notify({
    name,
    error,
    type: 'test-end',
    result: dumpResult({ error, name }),
  })
  return res
}

function dumpResult({ error, name }) {
  if (error === null) {
    return `${TICK} ${name}`
  } else {
    return `${CROSS} ${name}` + EOL
      + indent(filterStack({ error, name }), ' | ')
  }
}

/**
 * Run test suite (wrapper for notify).
 * @param {function} notify The function to call for notifications.
 * @param {string[]} path The path to the test suite.
 * @param {string} snapshot The path to the snapshot dir.
 * @param {string[]} snapshotRoot Parts to ignore in the beginning of snapshot paths.
 */
       async function runTestSuiteAndNotify(
  notify, path, snapshot, snapshotRoot, { name, tests, persistentContext }, onlyFocused, interactive,
) {
  const n = getNames(persistentContext)
  // console.log('will run a test suite %s', n)
  notify({ type: 'test-suite-start', name })
  let pc, res
  if (persistentContext) {
    // console.log('will evaluate %s', n)
    pc = await evaluatePersistentContext(persistentContext)
    bindContexts(tests, pc)
  }
  try {
    const newPath = [...path, replaceFilename(name)]
    res = await runInSequence(notify, newPath, tests, onlyFocused, snapshot, snapshotRoot, interactive)
    notify({ type: 'test-suite-end', name })
  } finally {
    if (pc) {
      // console.log('will destroy %s', n)
      await destroyPersistentContext(pc)
    }
  }
  return res
}

const bindContexts = (tests, pc) => {
  tests.forEach((t) => {
    t.persistentContext = pc
  })
}

const evalContext = async (context, timeout) => {
  const p = evaluateContext(context)
  const _timeout = context._timeout || timeout
  const res = await promto(p, _timeout, `Evaluate persistent context ${
    context.name ? context.name : ''}`)
  return res
}

const evaluatePersistentContext = async (context, timeout = 5000) => {
  const c = Array.isArray(context) ? context : [context]
  const res = await Promise.all(c.map(cc => evalContext(cc, timeout)))
  return res
  // await p <- time-leak
}

const destroyContext = async (context, timeout) => {
  const p = destroyContexts([context])
  const _timeout = context._timeout || timeout
  const res = await promto(p, _timeout, `Destroy persistent context ${
    context.name ? context.name : ''}`)
  return res
}

const destroyPersistentContext = async (contexts, timeout = 5000) => {
  const res = await Promise.all(contexts.map(cc => destroyContext(cc, timeout)))
  return res
  // await p <- time-leak (what?)
}

const getNames = persistentContext => {
  if (!persistentContext) return ''
  const p = Array.isArray(persistentContext) ? persistentContext : [persistentContext]
  return p.map(({ name }) => name).join(', ')
}

/**
 * Run all tests in sequence, one by one.
 * @param {function} [notify] A notify function to be passed to run method.
 * @param {string[]} path The path to the test suite in form of names of parent test suites and the current one.
 * @param {Test[]} tests An array with tests to run.
 * @param {boolean} [onlyFocused=false] Run only focused tests.
 * @param {string} snapshot The path to the snapshot file.
 */
       async function runInSequence(notify = () => {}, path, tests, onlyFocused, snapshot, snapshotRoot, interactive) {
  const res = await reducer(tests, {
    onlyFocused,
    runTest(test) {
      return runTestAndNotify(notify, path, snapshot, snapshotRoot, test, interactive)
    },
    runTestSuite(testSuite, hasFocused) {
      return runTestSuiteAndNotify(notify, path, snapshot, snapshotRoot, testSuite, onlyFocused ? hasFocused : false, interactive)
    },
  })
  return res
}

module.exports=runTestAndNotify

module.exports.runTestSuiteAndNotify = runTestSuiteAndNotify
module.exports.runInSequence = runInSequence