let erte = require('erte'); if (erte && erte.__esModule) erte = erte.default;
const { equal } = require('assert');

       const assertExpected = (result, expected) => {
  try {
    equal(result, expected)
  } catch (err) {
    const e = erte(result, expected)
    console.log(e) // eslint-disable-line no-console
    throw err
  }
}

module.exports.assertExpected = assertExpected
//# sourceMappingURL=index.js.map