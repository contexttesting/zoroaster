import erotic from 'erotic'
import { equal } from 'assert'

export const TEST_ERROR_MESSAGE = 'When you are in doubt abstain.'
export const TEST_RETURN_MESSAGE = 'test result'

export const failingTest = () => {
  throw new Error(TEST_ERROR_MESSAGE)
}

export const asyncFailingTest = async () => {
  throw new Error(TEST_ERROR_MESSAGE)
}

export const asyncTest = async () => {
  await new Promise(r => setTimeout(r, 100))
}

export const contextFailingTest = ({ errorMessage }) => {
  throw new Error(errorMessage)
}

export const asyncContextFailingTest = async ({ errorMessage }) => {
  const e = erotic()
  await new Promise((_, reject) => {
    setTimeout(
      () => {
        reject(e(errorMessage))
      },
      100,
    )
  })
}

export const contextPassingTest = ({ returnMessage }) => {
  equal(returnMessage, TEST_RETURN_MESSAGE)
}

export const timeoutFailingTest = async () => {
  await new Promise((r) => {
    setTimeout(r, 300)
  })
}

export const test = () => {
  // return TEST_RETURN_MESSAGE
}
