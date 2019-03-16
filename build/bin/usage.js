let usually = require('usually'); if (usually && usually.__esModule) usually = usually.default;

module.exports=() => {
  const usage = usually({
    usage: {
      pathToSpec: 'The path to a test suite file.',
      '-w, --watch': 'Monitor files for changes and re-run tests.',
      '-a, --alamode': 'Require ÀLaMode to enable import/export & JSX.',
      '-b, --babel': 'Require babel/register.',
      '-s, --snapshot': 'The path to the snapshot dir.\nDefault test/snapshot.',
      '-r, --snapshotRoot': 'Comma-separated snapshot roots.\nDefault test/spec,test/mask.',
      '-v, --version': 'Print version number and exit.',
      '-h, --help': 'Display this usage information.',
    },
    description: 'A testing framework with support for test contexts.',
    line: 'zoroaster pathToSpec [pathToSpecN] [-w] [-ab] [-sr] [-vh]',
    example: 'zoroaster test/spec test/mask -a',
  })
  return usage
}