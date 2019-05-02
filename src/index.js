/**
 * Service context.
 */
export default class Zoroaster {
  /**
   * Changes the extension with which the snapshot is saved. Only applies to the string results, objects will be saved in `.json`.
   * @param {string} extension The extension with which to save the snapshot.
   */
  snapshotExtension(extension) {
    // this.extension = extension
  }
  /**
   * Indicates that the snapshot should be read from another test in the same test suite.
   * @param {string} testCase The name of another test case that produced the snapshot.
   * @param {string} [extension] The extension with which to save the snapshot.
   */
  snapshotSource(testCase, extension) {

  }
  /**
   * When extending this context, the override will set the extension of the snapshot file for all tests in the test suite. Default `txt`.
   */
  static get snapshotExtension() {
    return 'txt'
  }
  /**
   * When extending this context, the override will dictate how an object returned by tests is serialised for comparison and saving as a JSON.
   * @param {*} object The return value of the test.
   * @returns {*} A serialised object.
   */
  static serialise(object) {
    return object
  }
}