import t from './tests' // return to import * as t when added in @a-la/import

const { TEST_ERROR_MESSAGE, TEST_RETURN_MESSAGE, ...tests } = t

const testSuite = {
  context: {
    errorMessage: TEST_ERROR_MESSAGE,
    returnMessage: TEST_RETURN_MESSAGE,
  },
  ...tests,
}

export default testSuite
