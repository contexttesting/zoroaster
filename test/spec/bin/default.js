import throws from 'assert-throws'
import { deepEqual } from 'assert-diff'
import { buildDirectory } from '../../../src/lib/bin'

const T = {
  async 'builds a directory'() {
    const ts = await buildDirectory('test/fixture/root')
    deepEqual(Object.keys(ts), ['default', 'testA', 'testB'])
  },
  async 'throws when cannot merge'() {
    await throws({
      fn: buildDirectory,
      args: 'test/fixture/root-merge',
      message: 'Duplicate key testA',
    })
  },
}

export default T