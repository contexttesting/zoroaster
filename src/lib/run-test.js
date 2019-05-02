import { EOL } from 'os'
import reducer, { runTest, evaluateContext, destroyContexts } from '@zoroaster/reducer'
import promto from 'promto'
import { c as color } from 'erte'
import { TICK, CROSS, indent, filterStack, replaceFilename } from './'
import handleSnapshot from './snapshot'
import Test from './Test' // eslint-disable-line
import TestSuite from './TestSuite' // eslint-disable-line

const Zoroaster = require(/* ok static analysis */ '../')

/**
 * Run the test.
 * @param {!Function|undefined} notify - notify function
 * @param {!Array<string>} path Abstract path to the test consisting of parent test-suites' names.
 * @param {!Test} test The test to run.
 * @param {!Object} [options]
 * @param {Error} [error] A test suite error that each test will fail with.
 */
async function runTestAndNotify(notify, path, { name, context, fn, timeout, persistentContext }, options = {}, error = null) {
  if (notify) notify({
    name,
    type: 'test-start',
  })
  let ext, snapshotSource, serialise
  const tc = Array.isArray(context) ? context : [context]
  tc.forEach((c) => {
    if (c.prototype instanceof Zoroaster) {
      ext = c['snapshotExtension']
      serialise = c['serialise']
    }
  })
  // only tests in masks won't have a name
  const ttc = fn.name ? tc.slice(0, fn.length) : tc
  const testContext = ttc.map((c) => {
    try {
      if (c === Zoroaster || c.prototype instanceof Zoroaster)
        return {
          'snapshotExtension'(e) { ext = e },
          'snapshotSource'(t, e) { snapshotSource = t; if (e) ext = e },
          // 'disableSpread'(d) { disableSpread = d },
        }
      return c
    } catch (err) {
      return c
    }
  })
  let res; const h = (err) => {
    error = err
  }
  if (!error) {
    process.once('uncaughtException', h)
    process.once('unhandledRejection', h)
    try {
      res = await runTest({
        context: testContext,
        persistentContext,
        fn,
        timeout,
      })
      let { result, error: testError } = res
      // if wasn't an unhandled one
      if (!error) error = testError
      try {
        if (result !== undefined && serialise) result = serialise(result)
        await handleSnapshot(result,
          snapshotSource || name,
          path, options.snapshot, options.snapshotRoot, options.interactive, ext)
      } catch (err) {
        error = err
      }
      // used in masks to update the result file
      if (options.interactive && testError && testError['handleUpdate']) {
        try {
          const updated = await testError['handleUpdate']()
          if (updated) error = null
        } catch (err) {
          // in case there's an error in the handle logic
          error = err
        }
      }
    } finally {
      process.removeListener('uncaughtException', h)
      process.removeListener('unhandledRejection', h)
    }
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
 * @param {!Function|undefined} notify The function to call for notifications.
 * @param {!Array<string>} path The path to the test suite.
 * @param {!_contextTesting.TestSuite} testSuite The test suite
 * @param {boolean} [onlyFocused] Only run focussed tests.
 * @param {*} [options]
 * @param {Error} [error]
 */
export async function runTestSuiteAndNotify(
  notify, path, { name, tests, persistentContext }, onlyFocused, options, error,
) {
  // const n = getNames(persistentContext)
  // console.log('will run a test suite %s', n)
  if (notify) notify({ type: 'test-suite-start', name })
  let pc, res
  if (persistentContext && !error) {
    // console.log('will evaluate %s', n)
    try {
      pc = await evaluatePersistentContext(persistentContext)
      bindContexts(tests, pc)
    } catch (err) {
      // maybe make test-suite-error notify event rather than failing each test
      err.message = `Persistent context failed to evaluate: ${err.message}`
      /** @type {!Array<string>} */
      const s = err.stack.split('\n', 2)
      err.stack = s.join('\n')
      // const i = s.findIndex(st => {
      //   return / at evaluateContext.+?reducer/.test(st)
      // })
      // if (i != -1) { // wat
      //   err.stack = s.slice(0, i).join('\n')
      // }
      error = err
    }
  }
  try {
    const newPath = [...path, replaceFilename(name)]
    res = await runInSequence(notify, newPath, tests, onlyFocused, options, error)
    if (notify) notify({ type: 'test-suite-end', name })
  } finally {
    if (pc) {
      // console.log('will destroy %s', n)
      try {
        await destroyPersistentContext(pc)
      } catch (err) {
        /** @type {!Array<string>} */
        const s = err.stack.split('\n', 2)
        err.stack = s.join('\n')
        // const i = s.findIndex(st => {
        //   return / at contexts\.map.+?reducer/.test(st)
        // })
        // if (i != -1) { // wat
        //   err.stack = s.slice(0, i).join('\n')
        // }
        console.log(color(err.stack, 'red'))
      }
    }
  }
  return res
}

/**
 * @param {!Array<!Test>} tests
 */
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

// const getNames = persistentContext => {
//   if (!persistentContext) return ''
//   const p = Array.isArray(persistentContext) ? persistentContext : [persistentContext]
//   return p.map(({ name }) => name).join(', ')
// }

/**
 * Run all tests in sequence, one by one. The entry point to the runner.
 * @param {!Function|undefined} notify A notify function to be passed to run method.
 * @param {!Array<string>} path The path to the test suite in form of names of parent test suites and the current one.
 * @param {!Array<!(Test|TestSuite)>} tests An array with tests to run.
 * @param {boolean} [onlyFocused=false] Run only focused tests.
 * @param {{ snapshotRoot: !Array<string>, snapshot: string, interactive: boolean }} [options] Options from the runner.
 * @param {!Error} [error]
 */
export async function runInSequence(notify, path, tests, onlyFocused, options, error) {
  const res = await reducer(tests, {
    onlyFocused,
    runTest(test) {
      return runTestAndNotify(notify, path, test, options, error)
    },
    runTestSuite(testSuite, hasFocused) {
      return runTestSuiteAndNotify(notify, path, testSuite, onlyFocused ? hasFocused : false, options, error)
    },
  })
  return res
}

export default runTestAndNotify