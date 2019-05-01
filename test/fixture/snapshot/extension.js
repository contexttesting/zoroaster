const Zoroaster = require(`../../../${process.env.ALAMODE_ENV == 'test-build' ? 'depack' : 'src'}`)

export default {
  context: Zoroaster,
  'test'({ snapshotExtension }) {
    snapshotExtension('md')
    return '[å®† ∂éçø](https://artd.eco)'
  },
  'test2'({ snapshotSource }) {
    snapshotSource('test', 'md')
    return '[å®† ∂éçø](https://artd.eco)'
  },
}