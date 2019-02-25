const { EOL } = require('os');
let reducer = require('@zoroaster/reducer'); const { runTest } = reducer; if (reducer && reducer.__esModule) reducer = reducer.default;
const { TICK, CROSS, indent, filterStack } = require('.');
const { evaluateContext, destroyContexts } = require('@zoroaster/reducer/build/lib');
let promto = require('promto'); if (promto && promto.__esModule) promto = promto.default;

/**
 * Run the test.
 * @param {function} [notify] - notify function
 */
async function runTestAndNotify(notify, { name, context, fn, timeout, persistentContext }) {
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
  const { error } = res
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
 */
       async function runTestSuiteAndNotify(
  notify, { name, tests, persistentContext }, onlyFocused,
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
    res = await runInSequence(notify, tests, onlyFocused)
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

const evaluatePersistentContext = async (context, timeout = 5000) => {
  const p = evaluateContext(context)
  const res = await promto(p, timeout, `Evaluate persistent context ${
    context.name ? context.name : ''}`)
  return res
  // await p <- time-leak
}
const destroyPersistentContext = async (context, timeout = 5000) => {
  const p = destroyContexts([context])
  const res = await promto(p, timeout, `Destroy persistent context ${
    context.name ? context.name : ''}`)
  return res
  // await p <- time-leak
}

const getNames = persistentContext => {
  if (!persistentContext) return ''
  const p = Array.isArray(persistentContext) ? persistentContext : [persistentContext]
  return p.map(({ name }) => name).join(', ')
}

/**
 * Run all tests in sequence, one by one.
 * @param {function} [notify] A notify function to be passed to run method.
 * @param {Test[]} tests An array with tests to run.
 * @param {boolean} [onlyFocused = false] Run only focused tests.
 */
       async function runInSequence(notify = () => {}, tests, onlyFocused) {
  const res = await reducer(tests, {
    onlyFocused,
    runTest: runTestAndNotify.bind(null, notify),
    runTestSuite: runTestSuiteAndNotify.bind(null, notify),
  })
  return res
}

module.exports=runTestAndNotify

module.exports.runTestSuiteAndNotify = runTestSuiteAndNotify
module.exports.runInSequence = runInSequence