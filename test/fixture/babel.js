import { equal } from 'assert'
import erte, { c, b } from '@a-la/fixture-babel'

export default {
  'runs erte'() {
    const res = erte()
    equal(res, 'erte')
  },
  'runs c'() {
    const res = c()
    equal(res, 'c')
  },
  'runs b'() {
    const res = b()
    equal(res, 'a')
  },
}