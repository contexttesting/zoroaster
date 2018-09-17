import makeTestSuite, { getArgs } from '../../src/lib/make-test-suite'

const ts = makeTestSuite('test/result/get-args.md', {
  getResults(input) {
    const matches = getArgs(input)
    return matches
  },
  jsonProps: ['expected'],
})

export default ts