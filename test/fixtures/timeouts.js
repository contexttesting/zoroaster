class Context {
  async _init() {

  }
  async _destroy() {

  }
  start() {
    this.started = 'ok'
  }
  getStarted() {
    return this.started
  }
}

export default {
  context: Context,
  'a test'({ start, getStarted }) {
    start()
    const s = getStarted()
    console.log(s)
  },
}