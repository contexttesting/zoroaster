var errorMessage = 'When you are in doubt abstain.';
var testSuite = {
  context: {
    errorMessage
  },

  test1() {},

  test2(ctx) {
    throw new Error(ctx.errorMessage);
  },

  test3() {
    return new Promise(function ($return, $error) {
      return $return();
    }.bind(this));
  },

  test4: function test4() {
    return 'test result';
  },

  test5() {
    return new Promise(function ($return, $error) {
      return Promise.resolve(new Promise(function (r) {
        return setTimeout(r, 100);
      })).then(function ($await_1) {
        try {
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  },

  test6() {
    return new Promise(function ($return, $error) {
      return Promise.resolve(new Promise(function (_, reject) {
        setTimeout(function () {
          return reject(new Error('Error from Promise constructor'));
        }, 100);
      })).then(function ($await_2) {
        try {
          return $return();
        } catch ($boundEx) {
          return $error($boundEx);
        }
      }.bind(this), $error);
    }.bind(this));
  }

};
module.exports = testSuite;