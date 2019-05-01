import { equal, strictEqual, ok } from 'assert'
import { throws } from '@zoroaster/assert'

const T = {
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
      equal(message, 'Function should have thrown.')
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
    }).catch(({ message }) => {
      ok(/TER != TERRA/.test(message))
    })
  },
  async 'throws when asserting on error strict equality'() {
    const error = new Error('test-error')
    await throws({
      fn() {
        return Promise.reject(error)
      },
      error: new Error('test-error-assert'),
    }).catch(({ message }) => {
      equal(message, 'Error: test-error is not strict equal to Error: test-error-assert.')
    })
  },
  async 'asserts on error strict equality'() {
    const error = new Error('test-error')
    await throws({
      async fn() {
        throw error
      },
      error,
    })
  },
  async 'asserts on error message with regular expression'() {
    await throws({
      async fn() {
        throw new Error('test-error')
      },
      message: /test-error/,
    })
  },
  async 'returns the thrown error'() {
    const error = new Error('test-error')
    const res = await throws({
      async fn() {
        throw error
      },
      message: /test-error/,
    })
    strictEqual(res, error)
  },
  async 'throws when asserting on error message with regular expression'() {
    await throws({
      async fn() {
        throw new Error('test-error')
      },
      message: /test-error-assert/,
    }).catch(({ message }) => {
      equal(message, 'test-error does not match regular expression /test-error-assert/')
    })
  },
}

export default T
