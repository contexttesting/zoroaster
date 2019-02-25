const ts = {
  persistentContext: class PC {
    async _init() {
      await new Promise(r => setTimeout(r, 50))
    }
    get pc() {
      return 'pc'
    }
    async _destroy() {
      await new Promise(r => setTimeout(r, 50))
      console.log('The Persistent Context Destroyed')
    }
  },
  test({ pc }) {
    console.log('The Persistent Context Is %s', pc)
  },
  test2() {
    'ok'
  },
}

export default ts