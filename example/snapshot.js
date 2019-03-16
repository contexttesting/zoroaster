import { asyncSoftware } from './src'

const TestSuite = {
  async 'supports snapshots'() {
    const res = await asyncSoftware('string')
    return res
  },
  async 'fails if snapshot is different'() {
    const res = await asyncSoftware('string')
    return res
  },
  async 'fails if snapshot exists'() {
    await asyncSoftware('string')
    return undefined
  },
  async 'fails if snapshot is of different type'() {
    await asyncSoftware('string')
    return { hello: 'world' }
  },
}

export default TestSuite