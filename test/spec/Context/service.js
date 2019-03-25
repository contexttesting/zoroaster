import { ok, equal } from 'assert'
import runTestAndNotify from '../../../src/lib/run-test'

export default {
  async 'does not pass more contexts than needed'() {
    let hasInitA = false
    let hasInitB = false
    let res
    await runTestAndNotify(null, [], '', [], {
      name: 'test',
      context: [class {
        _init() {
          hasInitA = true
          this.A = 'A'
        }
      }, class {
        _init() {
          hasInitB = true
        }
      }],
      fn({ A }) { res = A },
    })
    ok(hasInitA, 'The function has not initialised.')
    ok(!hasInitB, 'The function has initialised.')
    equal(res, 'A')
  },
}