import { join } from 'path'

export default class Context {
  async _init() {
    // an async set-up
    await new Promise(r => setTimeout(r, 50))
  }
  /**
   * A tagged template that returns the relative path to the fixture.
   * @param {string} file
   * @example
   * fixture`input.txt` // -> test/fixture/input.txt
   */
  fixture(file) {
    return join('test/fixture', file)
  }
  /**
   * Returns country of origin.
   */
  async getCountry() {
    return 'Iran'
  }
  async _destroy() {
    // an async tear-down
    await new Promise(r => setTimeout(r, 50))
  }
}