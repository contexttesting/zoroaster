import usually from 'usually'

export default () => {
  const usage = usually({
    usage: {
      pathToSpec: 'The path to a test suite file.',
      '-w, --watch': 'Monitor files for changes and re-run tests.',
      '-a, --alamode': 'Require alamode (to enable import/export).',
      '-b, --babel': 'Require babel/register.',
      '-v, --version': 'Print version number and exit.',
      '-h, --help': 'Display this usage information.',
    },
    description: 'A testing framework with support for test contexts.',
    line: 'zoroaster pathToSpec [pathToSpecN] [-w] [-ab] [-vh]',
    example: 'zoroaster test/spec -a',
  })
  return usage
}