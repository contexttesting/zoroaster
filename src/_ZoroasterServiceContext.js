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
}