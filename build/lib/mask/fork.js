const { deepEqual } = require('assert-diff');
const { fork } = require('spawncommand');
let mismatch = require('mismatch'); if (mismatch && mismatch.__esModule) mismatch = mismatch.default;
const { assertExpected } = require('./');

/**
 * @param {string|ForkConfig} forkConfig Parameters for forking.
 * @param {string} forkConfig.module The path to the module to fork.
 * @param {(args: string[], ...contexts?: Context[]) => string[]|Promise.<string[]>} [forkConfig.getArgs] The function to get arguments to pass the forked processed based on parsed masks input and contexts.
 * @param {(...contexts?: Context[]) => ForkOptions} [forkConfig.getOptions] The function to get options for the forked processed, such as `ENV` and `cwd`, based on contexts.
 * @param {ForkOptions} [forkConfig.options] Options for the forked processed, such as `ENV` and `cwd`.
 * @param {string[]} args
 * @param {Context[]} contexts
 */
       const getForkArguments = async (forkConfig, args, context) => {
  /**
   * @type {ForkOptions}
   */
  const stdioOpts = {
    stdio: 'pipe',
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
  let opt
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
 * @param {string|ForkConfig} forkConfig
 */
const runFork = async ({
  forkConfig,
  input,
  props: { stdout, stderr, code },
  contexts,
}) => {
  const a = getArgs(input)
  const { mod, args, options } = await getForkArguments(forkConfig, a, contexts)
  const { promise } = fork(mod, args, options)
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

       const getArgs = (input) => {
  const res = mismatch(/(['"])?([\s\S]+?)\1(\s+|$)/g, input, ['q', 'a'])
    .map(({ a }) => a)
  return res
}

module.exports=runFork

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
 */


module.exports.getForkArguments = getForkArguments
module.exports.getArgs = getArgs
//# sourceMappingURL=fork.js.map