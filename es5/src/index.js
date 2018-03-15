var _require = require('path'),
    resolve = _require.resolve;

var spawnCommand = require('spawncommand');

var BIN_PATH = resolve(__dirname, '../bin/zoroaster.js');

function getSpawnOptions(bin, _args) {
  'use strict';

  var program;
  var args = Array.isArray(_args) ? _args : [];

  if (!/^win/.test(process.platform)) {
    // linux
    program = bin;
  } else {
    // windows
    program = process.env.comspec;
    args = [].concat(['/c', 'node', bin], args);
  }

  return {
    program,
    args
  };
}
/**
 * Start zoroaster process, and return a child process with .promise property.
 * Basically, a spawnCommand wrapper around zoroaster binary. Works on Windows
 * as well as Linux.
 * @param {string[]} args An array of strings as arguments
 * @param {object} options Options to pass when creating child process
 * @returns {ChildProcess} An instance of a ChildProcess, with `.promise` property,
 * which will be resolved when tests are finished.
 */


function run(args, options) {
  var spawnOptions = getSpawnOptions(BIN_PATH, args);
  var proc = spawnCommand(spawnOptions.program, spawnOptions.args, options);
  return proc;
}

module.exports = run;