import { deepEqual } from 'assert-diff'
import { fork } from 'spawncommand'
import mismatch from 'mismatch'
import forkFeed from 'forkfeed'
import { assertExpected } from './'

/**
 * @param {string|ForkConfig} forkConfig Parameters for forking.
 * @param {string} forkConfig.module The path to the module to fork.
 * @param {(args: string[], ...contexts?: Context[]) => string[]|Promise.<string[]>} [forkConfig.getArgs] The function to get arguments to pass the forked processed based on parsed masks input and contexts.
 * @param {(...contexts?: Context[]) => ForkOptions} [forkConfig.getOptions] The function to get options for the forked processed, such as `ENV` and `cwd`, based on contexts.
 * @param {ForkOptions} [forkConfig.options] Options for the forked processed, such as `ENV` and `cwd`.
 * @param {string[]} args
 * @param {Context[]} contexts
 */
export const getForkArguments = async (forkConfig, args, context) => {
  /**
   * @type {ForkOptions}
   */
  const stdioOpts = {
    stdio: 'pipe',
    execArgv: [],
  }
  if (typeof forkConfig == 'string') {
    return {
      mod: forkConfig,
      args,
      options: stdioOpts,
    }
  }
  const {
    module: mod,
    getArgs: getForkArgs,
    options,
    getOptions,
  } = forkConfig
  const a = getForkArgs ? await getForkArgs(args, ...context) : args
  let opt = stdioOpts
  if (options) {
    opt = {
      ...stdioOpts,
      ...options,
    }
  } else if (getOptions) {
    const o = await getOptions(...context)
    opt = {
      ...stdioOpts,
      ...o,
    }
  }
  return {
    mod,
    args: a,
    options: opt,
  }
}

/**
 * @param {{forkConfig: string|ForkConfig}}
 */
const runFork = async ({
  forkConfig,
  input,
  props: { stdout, stderr, code },
  contexts,
}) => {
  const a = getArgs(input)
  const {
    mod, args, options,
  } = await getForkArguments(forkConfig, a, contexts)
  const { promise,
    stdout: so,
    stdin: i,
    stderr: se,
  } = fork(mod, args, options)

  let logStdout, logStderr
  if (forkConfig.log === true) {
    logStdout = process.stdout
    logStderr = process.stderr
  } else if (typeof forkConfig == 'object') {
    ({ stdout: logStdout, stderr: logStderr } = forkConfig)
  }

  forkFeed(so, i, forkConfig.inputs, logStdout)
  forkFeed(se, i, forkConfig.stderrInputs, logStderr)

  const res = await promise
  const { code: c, stdout: o, stderr: e } = res
  assertForkOutput(o, stdout)
  assertForkOutput(e, stderr)
  if (code && c != code)
    throw new Error(`Fork exited with code ${c} != ${code}`)
  return res
}

const assertForkOutput = (actual, expected) => {
  if (typeof expected == 'string') {
    assertExpected(actual, expected)
  } else if (expected) {
    const a = JSON.parse(actual)
    deepEqual(a, expected)
  }
}

/** @param {string} input */
export const getArgs = (input) => {
  const res = mismatch(/(['"])?([\s\S]+?)\1(\s+|$)/g, input, ['q', 'a'])
    .map(({ a }) => a)
  return res
}

export default runFork

/* documentary types/context.xml */
/**
 * @typedef {Object} Context A context made with a constructor.
 * @prop {() => void} [_init] A function to initialise the context.
 * @prop {() => void} [_destroy] A function to destroy the context.
 */

/* documentary types/fork-config.xml */
/**
 * @typedef {import('child_process').ForkOptions} ForkOptions
 *
 * @typedef {Object} ForkConfig Parameters for forking.
 * @prop {string} module The path to the module to fork.
 * @prop {(args: string[], ...contexts?: Context[]) => string[]|Promise.<string[]>} [getArgs] The function to get arguments to pass the forked processed based on parsed masks input and contexts.
 * @prop {(...contexts?: Context[]) => ForkOptions} [getOptions] The function to get options for the forked processed, such as `ENV` and `cwd`, based on contexts.
 * @prop {ForkOptions} [options] Options for the forked processed, such as `ENV` and `cwd`.
 * @prop {[RegExp, string][]} [inputs] Inputs to push to `stdin` when `stdout` writes data. The inputs are kept on stack, and taken off the stack when the RegExp matches the written data.
 * @prop {[RegExp, string][]} [stderrInputs] Inputs to push to `stdin` when `stderr` writes data (similar to `inputs`).
 * @prop {boolean|{stderr: Writable, stdout: Writable}} [log=false] Whether to pipe data from `stdout`, `stderr` to the process's streams. If an object is passed, the output will be piped to streams specified as its `stdout` and `stderr` properties. Default `false`.
 */
