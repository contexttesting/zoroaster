import erte from 'erte'
import { equal } from 'assert'

export const assertExpected = (result, expected) => {
  try {
    equal(result, expected)
  } catch (err) {
    const e = erte(result, expected)
    console.log(e) // eslint-disable-line no-console
    throw err
  }
}