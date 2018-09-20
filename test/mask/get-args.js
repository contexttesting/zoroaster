import makeTestSuite from '../../src/lib/make-test-suite'
import { getArgs } from '../../src/lib/mask/fork'

const ts = makeTestSuite('test/result/get-args.md', {
  getResults(input) {
    const matches = getArgs(input)
    return matches
  },
  jsonProps: ['expected'],
})

export default ts