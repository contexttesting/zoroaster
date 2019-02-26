const SNAPSHOT_DIR = 'example/Zoroaster/test/snapshot'

export default class Context {
  async _init() {
    // an async set-up
    await new Promise(r => setTimeout(r, 50))
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
  get SNAPSHOT_DIR() {
    return SNAPSHOT_DIR
  }
}
