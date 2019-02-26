import CDP from './_cdp'

export default class PersistentContext {
  async _init() {
    let client
    client = await CDP({
      host: '172.31.12.175',
      port: '9222',
    })
    const { Network, Page, Runtime } = client
    Network.requestWillBeSent(() => {
      process.stdout.write('.')
    })
    await Network.enable()
    await Page.enable()
    this._client = client
    this._Page = Page
    this.Runtime = Runtime
    console.log('[%s]: %s', 'RemoteChrome', 'Page enabled')
  }
  static get _timeout() {
    return 10000
  }
  /**
   * The page opened in the browser.
   */
  get Page() {
    return this._Page
  }
  async _destroy() {
    if (this._client) {
      await this._client.close()
    }
  }
}