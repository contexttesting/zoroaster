"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "assert", {
  enumerable: true,
  get: function () {
    return _assert.default;
  }
});
Object.defineProperty(exports, "equal", {
  enumerable: true,
  get: function () {
    return _assert.equal;
  }
});
Object.defineProperty(exports, "ok", {
  enumerable: true,
  get: function () {
    return _assert.ok;
  }
});
Object.defineProperty(exports, "deepEqual", {
  enumerable: true,
  get: function () {
    return _assertDiff.deepEqual;
  }
});
Object.defineProperty(exports, "throws", {
  enumerable: true,
  get: function () {
    return _assertThrows.default;
  }
});

var _assert = _interopRequireWildcard(require("assert"));

var _assertDiff = require("assert-diff");

var _assertThrows = _interopRequireDefault(require("assert-throws"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }