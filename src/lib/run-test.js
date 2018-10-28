import { runTest } from '@zoroaster/reducer'
import { EOL } from 'os'
import reducer from '@zoroaster/reducer'
import { TICK, CROSS, indent, filterStack } from '.'

/**
 * Run the test.
 * @param {function} [notify] - notify function
 */
async function runTestAndNotify(notify, { name, context, fn, timeout }) {
  if (notify) notify({
    name,
    type: 'test-start',
  })
  const res = await runTest({
    context,
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
export async function runTestSuiteAndNotify(
  notify, { name, tests }, onlyFocused,
) {
  notify({ type: 'test-suite-start', name })
  const res = await runInSequence(notify, tests, onlyFocused)
  notify({ type: 'test-suite-end', name })
  return res
}

/**
 * Run all tests in sequence, one by one.
 * @param {function} [notify] A notify function to be passed to run method.
 * @param {Test[]} tests An array with tests to run.
 * @param {boolean} [onlyFocused = false] Run only focused tests.
 */
export async function runInSequence(notify = () => {}, tests, onlyFocused) {
  const res = await reducer(tests, {
    onlyFocused,
    runTest: runTestAndNotify.bind(null, notify),
    runTestSuite: runTestSuiteAndNotify.bind(null, notify),
  })
  return res
}

export default runTestAndNotify