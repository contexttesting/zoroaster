import erte from 'erte'
import getTests from '../lib/mask'
import { equal, throws } from '../assert'

/**
 * Make a test suite to test against a mask. `expected`, `error` properties  will always be available, and additional extensions to the test are available.
 * @param {string} maskPath Path to the mask.
 */
const makeTestSuite = (maskPath, {
  getActual,
  getThrowsConfig,
  context,
}) => {
  const tests = getTests(maskPath, [
    'expected',
    'error',
    // ...eventTitles,
  ])

  const hasFocused = tests.some(({ name }) => name.startsWith('!'))

  const t = tests.reduce((acc, {
    name, input, expected, error, onError,
  }) => {
    if (hasFocused && !name.startsWith('!')) return acc
    const nameError = name in acc ?
      new Error(`Repeated use of the test name ${name}.`) : null

    const fn = async (...contexts) => {
      if (nameError) throw nameError

      if (error) {
        if (!getThrowsConfig) throw new Error('No throws config is given.')
        const throwsConfig = getThrowsConfig(input, ...contexts)
        await assertError(throwsConfig)
        return
      }
      if (expected) {
        const actual = await getActual(input, ...contexts)
        assertExpected(actual, expected)
      }
    }
    acc[name] = async (...args) => {
      try {
        await fn(...args)
      } catch (err) {
        onError(err)
      }
    }
    return acc
  }, context ? { context } : {})
  return t
}

const assertError = async (throwsConfig, error) => {
  await throws({
    ...throwsConfig,
    message: error,
  })
}

const assertExpected = (result, expected) => {
  if (!expected) return
  try {
    equal(result, expected)
  } catch (err) {
    const e = erte(result, expected)
    console.log(e) // eslint-disable-line no-console
    throw err
  }
}

export default makeTestSuite