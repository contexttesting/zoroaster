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
  customTest,
  customProps = [],
  jsonProps = [],
}) => {
  const tests = getTests(maskPath, [
    'expected',
    'error',
    ...customProps,
    ...jsonProps,
  ])

  const hasFocused = tests.some(({ name }) => name.startsWith('!'))

  const t = tests.reduce((acc, {
    name, input, expected, error, onError, ...rest
  }) => {
    if (hasFocused && !name.startsWith('!')) return acc
    const nameError = name in acc ?
      new Error(`Repeated use of the test name ${name}.`) : null

    const fn = async (...contexts) => {
      if (nameError) throw nameError

      if (error) {
        if (!getThrowsConfig)
          throw new Error('No getThrowsConfig function is given.')
        const throwsConfig = getThrowsConfig(input, ...contexts)
        await assertError(throwsConfig, error)
        return
      }
      if (expected) {
        if (!getActual)
          throw new Error('No getActual function is given.')
        const actual = await getActual(input, ...contexts)
        assertExpected(actual, expected)
      }
      const parsedRest = Object.keys(rest).reduce((ac, k) => {
        const val = jsonProps.includes(k) ? JSON.parse(rest[k]) : rest[k]
        ac[k] = val
        return ac
      }, {})
      if (customTest) await customTest(input, parsedRest, ...contexts)
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