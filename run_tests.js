"use strict";

var _child_process = require("child_process");

var _path = require("path");

var _noddy = require("noddy");

var _package = require("./package.json");

/**
 * This file helps to run tests on Windows, as well as chooses to test ES5 for
 * Node < 8.6.0. Normal ES7 code is tested with Node 8.6+. The default binary
 * is actual source code, i.e. no transpilation, and es5 binary can be run with
 * zoroaster-es5
 */
var zoroaster = _package.bin.zoroaster,
    zoroasterEs5 = _package.bin.zoroasterEs5;
var force = process.argv.some(function (a) {
  return a === '--force';
});
var useEs5 = (0, _noddy.nodeLt)('v8.6.0') || force;

if (force) {
  console.log(`Using the force to summon the dead with ${zoroasterEs5}...`); // eslint-disable-line no-console
} else if (useEs5) {
  console.log(`Going down with ${zoroasterEs5}...`); // eslint-disable-line no-console
} else {
  console.log(`Thus spoke Zarathustra ${zoroaster}`); // eslint-disable-line no-console
}

var ZOROASTER = (0, _path.resolve)(__dirname, zoroaster);
var ZOROASTER_ES5 = (0, _path.resolve)(__dirname, zoroasterEs5);
var SPEC = (0, _path.resolve)(__dirname, 'test/spec');
var SPEC_ES5 = (0, _path.resolve)(__dirname, 'es5/test/spec');
var spec = useEs5 ? SPEC_ES5 : SPEC;
var node = useEs5 ? ZOROASTER_ES5 : ZOROASTER;
var args = [spec];

if (process.argv.find(function (argv) {
  return argv === '--watch';
})) {
  args.push('--watch');
}

(0, _child_process.fork)(node, args).on('exit', process.exit);
