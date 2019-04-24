let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;

       const argsConfig = {
  'tests': {
    description: 'The location of the test suite directory or file.',
    command: true,
    multiple: true,
  },
  'alamode': {
    description: 'Enable import/export transpilation with ÀLaMode.',
    boolean: true,
    short: 'a',
  },
  'babel': {
    description: 'Require `@babel/register` (needs to be installed).',
    boolean: true,
    short: 'b',
  },
  'watch': {
    description: 'Start the runner in _watch_ mode (rerun on changes).',
    boolean: true,
    short: 'w',
  },
  'timeout': {
    description: 'Timeout for tests in ms.',
    number: true,
    default: '2000',
    short: 't',
  },
  'snapshot': {
    description: 'The location of the snapshot dir.',
    default: 'test/snapshot',
    short: 's',
  },
  'snapshotRoot': {
    description: 'The list of folders that will be roots in the snapshot dir.',
    default: 'test/spec,test/mask',
    short: 'r',
  },
  'interactive': {
    description: 'Run in interactive mode, allowing to update snapshots\nand mask results when they don\'t match currently expected.',
    boolean: true,
    short: 'i',
  },
  'version': {
    description: 'Show the current version.',
    boolean: true,
    short: 'v',
  },
  'help': {
    description: 'Display help information.',
    boolean: true,
    short: 'h',
  },
}
const args = argufy(argsConfig)

/**
 * The location of the test suite directory or file.
 */
       const _tests = /** @type {string} */ (args['tests'])

/**
 * Enable import/export transpilation with ÀLaMode.
 */
       const _alamode = /** @type {boolean} */ (args['alamode'])

/**
 * Require `@babel/register` (needs to be installed).
 */
       const _babel = /** @type {boolean} */ (args['babel'])

/**
 * Start the runner in _watch_ mode (rerun on changes).
 */
       const _watch = /** @type {boolean} */ (args['watch'])

/**
 * Timeout for tests in ms. Default `2000`.
 */
       const _timeout = /** @type {number} */ (args['timeout']) || 2000

/**
 * The location of the snapshot dir. Default `test/snapshot`.
 */
       const _snapshot = /** @type {string} */ (args['snapshot']) || 'test/snapshot'

/**
 * The list of folders that will be roots in the snapshot dir. Default `test/spec,test/mask`.
 */
       const _snapshotRoot = /** @type {string} */ (args['snapshotRoot']) || 'test/spec,test/mask'

/**
 * Run in interactive mode, allowing to update snapshots
    and mask results when they don't match currently expected.
 */
       const _interactive = /** @type {boolean} */ (args['interactive'])

/**
 * Show the current version.
 */
       const _version = /** @type {boolean} */ (args['version'])

/**
 * Display help information.
 */
       const _help = /** @type {boolean} */ (args['help'])

/**
 * The additional arguments passed to the program.
 */
       const _argv = /** @type {!Array<string>} */ (args._argv)

module.exports.argsConfig = argsConfig
module.exports._tests = _tests
module.exports._alamode = _alamode
module.exports._babel = _babel
module.exports._watch = _watch
module.exports._timeout = _timeout
module.exports._snapshot = _snapshot
module.exports._snapshotRoot = _snapshotRoot
module.exports._interactive = _interactive
module.exports._version = _version
module.exports._help = _help
module.exports._argv = _argv