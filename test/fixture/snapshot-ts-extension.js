import Zoroaster from '../../src'

export default {
  context: Zoroaster,
  'test'({ snapshotExtension }) {
    snapshotExtension('md')
    return '[å®† ∂éçø](https://artd.eco)'
  },
}