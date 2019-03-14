import * as t from './tests'

const { TEST_ERROR_MESSAGE, TEST_RETURN_MESSAGE, ...tests } = t

const testSuite = {
  context: {
    errorMessage: TEST_ERROR_MESSAGE,
    returnMessage: TEST_RETURN_MESSAGE,
  },
  ...tests,
}

export default testSuite