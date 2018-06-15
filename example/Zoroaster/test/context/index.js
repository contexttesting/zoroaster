import { resolve } from 'path'

const SNAPSHOT_DIR = resolve(__dirname, '../snapshot')

export default class Context {
  /**
   * An async set-up in which country is acquired.
   */
  async _init() {
    /** @type {'Iran'} A country of origin */
    const country = await new Promise(r => setTimeout(() => r('Iran'), 50))
    this._country = country
  }
  /**
   * Returns country of origin.
   */
  getCountry() {
    return this._country
  }
  /**
   * An async tear-down in which country is destroyed
   */
  async _destroy() {
    await new Promise(r => setTimeout(r, 50))
    this._country = null
  }
  /**
   * Directory in which to save snapshots.
   */
  get SNAPSHOT_DIR() {
    return SNAPSHOT_DIR
  }
}
