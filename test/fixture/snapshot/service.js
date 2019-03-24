const Zoroaster = require(`../../../${process.env.ALAMODE_ENV == 'test-build' ? 'build' : 'src'}`)

export default {
  context: class extends Zoroaster {
    static get snapshotExtension() {
      return 'js'
    }
  },
  test() {
    return 'console.log(`hello world`)'
  },
  test2() {
    return 'console.log(`hello world2`)'
  },
}