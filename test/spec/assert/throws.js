import { equal, strictEqual } from 'assert'
import { throws } from '../../../assert'

const t = {
  async 'asserts on async error'() {
    const message = 'test-error'
    await throws({
      async fn() {
        throw new Error(message)
      },
      message,
    })
  },
  async 'asserts on sync error and fail'() {
    try {
      await throws({
        fn() { },
      })
      throw new Error('Throws did not throw')
    } catch ({ message }) {
      equal(message, 'Function should have thrown')
    }
  },
  async 'asserts on async error by code and fail'() {
    await throws({
      fn() {
        const err = new Error('test-error')
        err.code = 'TER'
        return Promise.reject(err)
      },
      code: 'TERRA',
    }).catch((error) => {
      equal(error.message, 'TER != TERRA')
    })
  },
  'throws when asserting on error strict equality'() {
    const error = new Error('test-error')
    return throws({
      fn() {
        return Promise.reject(error)
      },
      error: new Error('test-error-assert'),
    }).catch((error) => {
      equal(error.message, 'Error: test-error is not strict equal to Error: test-error-assert.')
    })
  },
  'asserts on error strict equality'() {
    const error = new Error('test-error')
    return throws({
      fn() {
        return Promise.reject(error)
      },
      error,
    })
  },
  'asserts on error message with regular expression'() {
    return throws({
      fn() {
        return Promise.reject(new Error('test-error'))
      },
      message: /test-error/,
    })
  },
  'returns the thrown error'() {
    const error = new Error('test-error')
    return throws({
      fn() {
        return Promise.reject(error)
      },
      message: /test-error/,
    }).then((res) => {
      strictEqual(res, error)
    })
  },
  'throws when asserting on error message with regular expression'() {
    return throws({
      fn() {
        return Promise.reject(new Error('test-error'))
      },
      message: /test-error-assert/,
    }).catch((error) => {
      equal(error.message, 'test-error does not match regular expression /test-error-assert/')
    })
  },
}

export default t
