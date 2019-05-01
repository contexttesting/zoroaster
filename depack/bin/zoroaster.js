#!/usr/bin/env node
             
const path = require('path');
const os = require('os');
const fs = require('fs');
const stream = require('stream');
const util = require('util');
const assert = require('assert');
const readline = require('readline');             
const {EOL:t, homedir:aa} = os;
const v = /\s+at.*(?:\(|\s)(.*)\)?/, ba = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ca = aa(), w = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(ba.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(h => {
    h = h.match(v);
    if (null === h || !h[1]) {
      return !0;
    }
    h = h[1];
    return h.includes(".app/Contents/Resources/electron.asar") || h.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(h);
  }).filter(h => h.trim()).map(h => b ? h.replace(v, (f, g) => f.replace(g, g.replace(ca, "~"))) : h).join("\n");
};
const x = (a, b, c, d, e) => {
  d = void 0 === d ? !1 : d;
  e = void 0 === e ? !1 : e;
  const h = c ? new RegExp(`^-(${c}|-${b})`) : new RegExp(`^--${b}`);
  b = a.findIndex(f => h.test(f));
  if (-1 == b) {
    return {argv:a};
  }
  if (d) {
    return {value:!0, argv:[...a.slice(0, b), ...a.slice(b + 1)]};
  }
  d = b + 1;
  c = a[d];
  if (!c || "string" == typeof c && c.startsWith("--")) {
    return {argv:a};
  }
  e && (c = parseInt(c, 10));
  return {value:c, argv:[...a.slice(0, b), ...a.slice(d + 1)]};
}, da = a => {
  const b = [];
  for (let c = 0; c < a.length; c++) {
    const d = a[c];
    if (d.startsWith("-")) {
      break;
    }
    b.push(d);
  }
  return b;
}, ea = () => {
  var a = y;
  return Object.keys(a).reduce((b, c) => {
    const d = a[c];
    if ("string" == typeof d) {
      return b[`-${d}`] = "", b;
    }
    c = d.command ? c : `--${c}`;
    d.short && (c = `${c}, -${d.short}`);
    let e = d.description;
    d.default && (e = `${e}\nDefault: ${d.default}.`);
    b[c] = e;
    return b;
  }, {});
};
const y = {tests:{description:"The location of the test suite directory or file.", command:!0, multiple:!0}, alamode:{description:"Enable import/export transpilation with \u00c0LaMode.", boolean:!0, short:"a"}, babel:{description:"Require `@babel/register` (needs to be installed).", boolean:!0, short:"b"}, watch:{description:"Start the runner in _watch_ mode (rerun on changes).", boolean:!0, short:"w"}, timeout:{description:"Timeout for tests in ms.", number:!0, default:"2000", short:"t"}, snapshot:{description:"The location of the snapshot dir.", 
default:"test/snapshot", short:"s"}, snapshotRoot:{description:"The list of folders that will be roots in the snapshot dir.", default:"test/spec,test/mask", short:"r"}, interactive:{description:"Run in interactive mode, allowing to update snapshots\nand mask results when they don't match currently expected.", boolean:!0, short:"i"}, version:{description:"Show the current version.", boolean:!0, short:"v"}, help:{description:"Display help information.", boolean:!0, short:"h"}}, z = function(a, b) {
  a = void 0 === a ? {} : a;
  b = void 0 === b ? process.argv : b;
  [, , ...b] = b;
  const c = da(b);
  b = b.slice(c.length);
  let d = !c.length;
  return Object.keys(a).reduce((e, h) => {
    var f = Object.assign({}, e);
    e = e.c;
    f = (delete f.c, f);
    if (0 == e.length && d) {
      return Object.assign({}, {c:e}, f);
    }
    const g = a[h];
    let k;
    if ("string" == typeof g) {
      ({value:k, argv:e} = x(e, h, g));
    } else {
      try {
        const {short:m, boolean:l, number:n, command:q, multiple:r} = g;
        q && r && c.length ? (k = c, d = !0) : q && c.length ? (k = c[0], d = !0) : {value:k, argv:e} = x(e, h, m, l, n);
      } catch (m) {
        return Object.assign({}, {c:e}, f);
      }
    }
    return void 0 === k ? Object.assign({}, {c:e}, f) : Object.assign({}, {c:e}, f, {[h]:k});
  }, {c:b});
}(y), fa = z.tests, ha = z.alamode, ia = z.babel, ja = z.watch, ka = z.timeout || 2000, la = z.snapshot || "test/snapshot", ma = z.snapshotRoot || "test/spec,test/mask", na = z.interactive, oa = z.version, pa = z.help, qa = z.c;
const {dirname:A, join:B, relative:ra, resolve:C} = path;
const {createReadStream:sa, createWriteStream:ta, lstat:D, mkdir:ua, readdir:F, rmdir:va, unlink:xa, unwatchFile:ya, watchFile:za} = fs;
var Aa = stream;
const {Transform:G, Writable:Ba} = stream;
const H = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, Ca = (a, b = !1) => H(a, 2 + (b ? 1 : 0)), Da = a => {
  ({callee:{caller:a}} = a);
  return a;
};
function Ea(a, b, c = !1) {
  return function(d) {
    var e = Da(arguments), {stack:h} = Error();
    const f = H(h, 2, !0), g = (h = d instanceof Error) ? d.message : d;
    e = [`Error: ${g}`, ...null !== e && a === e || c ? [b] : [f, b]].join("\n");
    e = w(e);
    return Object.assign(h ? d : Error(), {message:g, stack:e});
  };
}
;function I(a) {
  var {stack:b} = Error();
  const c = Da(arguments);
  b = Ca(b, a);
  return Ea(c, b, a);
}
;const Fa = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class Ga extends Ba {
  constructor(a) {
    var b = a || {}, c = Object.assign({}, b);
    const d = void 0 === b.binary ? !1 : b.binary, e = void 0 === b.rs ? null : b.rs;
    b = (delete c.binary, delete c.rs, c);
    const {F:h = I(!0), proxyError:f} = a || {}, g = (k, m) => h(m);
    super(b);
    this.a = [];
    this.D = new Promise((k, m) => {
      this.on("finish", () => {
        let l;
        d ? l = Buffer.concat(this.a) : l = this.a.join("");
        k(l);
        this.a = [];
      });
      this.once("error", l => {
        if (-1 == l.stack.indexOf("\n")) {
          g`${l}`;
        } else {
          const n = w(l.stack);
          l.stack = n;
          f && g`${l}`;
        }
        m(l);
      });
      e && Fa(this, e).pipe(this);
    });
  }
  _write(a, b, c) {
    this.a.push(a);
    c();
  }
  get i() {
    return this.D;
  }
}
const Ha = async a => {
  var b = void 0 === b ? {} : b;
  ({i:a} = new Ga(Object.assign({}, {rs:a}, b, {F:I(!0)})));
  return await a;
};
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function Ia(a, b, c) {
  let d = a[a.length - 1];
  d && d.f === b && d.l === c ? a[a.length - 1] = {count:d.count + 1, f:b, l:c} : a.push({count:1, f:b, l:c});
}
function Ja(a, b, c, d, e) {
  let h = c.length, f = d.length, g = b.b;
  e = g - e;
  let k = 0;
  for (; g + 1 < h && e + 1 < f && a.equals(c[g + 1], d[e + 1]);) {
    g++, e++, k++;
  }
  k && b.g.push({count:k});
  b.b = g;
  return e;
}
function Ka(a) {
  let b = [];
  for (let c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
function La(a, b) {
  var c = new Ma;
  a = Ka(a.split(""));
  b = Ka(b.split(""));
  let d = b.length, e = a.length, h = 1, f = d + e, g = [{b:-1, g:[]}];
  var k = Ja(c, g[0], b, a, 0);
  if (g[0].b + 1 >= d && k + 1 >= e) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; h <= f;) {
    a: {
      for (k = -1 * h; k <= h; k += 2) {
        var m = g[k - 1];
        let n = g[k + 1];
        var l = (n ? n.b : 0) - k;
        m && (g[k - 1] = void 0);
        let q = m && m.b + 1 < d;
        l = n && 0 <= l && l < e;
        if (q || l) {
          !q || l && m.b < n.b ? (m = {b:n.b, g:n.g.slice(0)}, Ia(m.g, void 0, !0)) : (m.b++, Ia(m.g, !0, void 0));
          l = Ja(c, m, b, a, k);
          if (m.b + 1 >= d && l + 1 >= e) {
            k = Na(c, m.g, b, a);
            break a;
          }
          g[k] = m;
        } else {
          g[k] = void 0;
        }
      }
      h++;
      k = void 0;
    }
    if (k) {
      return k;
    }
  }
}
class Ma {
  equals(a, b) {
    return a === b;
  }
  join(a) {
    return a.join("");
  }
}
function Na(a, b, c, d) {
  let e = 0, h = b.length, f = 0, g = 0;
  for (; e < h; e++) {
    var k = b[e];
    if (k.l) {
      k.value = a.join(d.slice(g, g + k.count)), g += k.count, e && b[e - 1].f && (k = b[e - 1], b[e - 1] = b[e], b[e] = k);
    } else {
      if (k.f) {
        k.value = a.join(c.slice(f, f + k.count));
      } else {
        let m = c.slice(f, f + k.count);
        m = m.map(function(l, n) {
          n = d[g + n];
          return n.length > l.length ? n : l;
        });
        k.value = a.join(m);
      }
      f += k.count;
      k.f || (g += k.count);
    }
  }
  c = b[h - 1];
  1 < h && "string" === typeof c.value && (c.f || c.l) && a.equals("", c.value) && (b[h - 2].value += c.value, b.pop());
  return b;
}
;const Oa = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, Pa = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function J(a, b) {
  return (b = Oa[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function K(a, b) {
  return (b = Pa[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function Qa(a, b) {
  return La(a, b).map(({f:c, l:d, value:e}) => {
    const h = e.split(" ");
    return c ? h.map(f => f.replace(/\n$/mg, "\u23ce\n")).map(f => J(f, "green")).join(K(" ", "green")) : d ? h.map(f => f.replace(/\n$/mg, "\u23ce\n")).map(f => J(f, "red")).join(K(" ", "red")) : J(e, "grey");
  }).join("");
}
;function L(a, b) {
  return a.replace(/^(?!\s*$)/mg, b);
}
function Ra({error:a, name:b}) {
  if (!a) {
    throw Error("cannot filter stack when a test does not have an error");
  }
  var c = a.stack.split("\n");
  const d = new RegExp(`at (.+\\.)?${b}`);
  b = c.findIndex(e => d.test(e)) + 1;
  c = c.slice(0, b).join("\n");
  return (c ? c : w(a.stack)).replace(/\n/g, t);
}
const Sa = " " + J("\u2713", "green") + " ", Ta = " " + J("\u2717", "red") + " ";
function Ua() {
  const a = [];
  return new G({objectMode:!0, transform(b, c, d) {
    var e = Object.assign({}, b);
    c = b.type;
    b = b.name;
    e = (delete e.type, delete e.name, e);
    "test-suite-start" == c && "default" != b ? a.push(b) : "test-suite-end" == c && "default" != b && a.pop();
    const h = a.slice();
    this.push(Object.assign({}, {type:c, name:b, stack:h}, e));
    d();
  }});
}
function Va() {
  return new G({objectMode:!0, transform(a, b, c) {
    var {type:d, name:e, stack:h, result:f} = a;
    "test-suite-start" == d && "default" != e ? (this.push(L(e, Array.from({length:2 * h.length}).join(" "))), this.push(t)) : "test-end" == d && (this.push(L(f, Array.from({length:2 * h.length}).join(" "))), this.push(t));
    c();
  }});
}
function Wa() {
  return new G({objectMode:!0, transform(a, b, c) {
    var {error:d, stack:e, name:h} = a;
    if (!d) {
      return c();
    }
    this.push("\u001b[31m");
    this.push(e.join(" > "));
    this.push(` > ${h}`);
    this.push("\u001b[0m");
    this.push(t);
    this.push(L(Ra({error:d, name:h}), "  "));
    this.push(t);
    this.push(t);
    c();
  }});
}
;function Xa(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function M(a, b, c) {
  const d = I(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:e} = a;
  if (!e) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((h, f) => {
    const g = (m, l) => m ? (m = d(m), f(m)) : h(c || l);
    let k = [g];
    Array.isArray(b) ? (b.forEach((m, l) => {
      Xa(e, l);
    }), k = [...b, g]) : 1 < Array.from(arguments).length && (Xa(e, 0), k = [b, g]);
    a(...k);
  });
}
;function Ya(a, b, c) {
  return setTimeout(() => {
    const d = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    d.stack = `Error: ${d.message}`;
    c(d);
  }, b);
}
function Za(a, b) {
  let c;
  const d = new Promise((e, h) => {
    c = Ya(a, b, h);
  });
  return {timeout:c, i:d};
}
async function N(a, b, c) {
  if (!(a instanceof Promise)) {
    throw Error("Promise expected");
  }
  if (!b) {
    throw Error("Timeout must be a number");
  }
  if (0 > b) {
    throw Error("Timeout cannot be negative");
  }
  const {i:d, timeout:e} = Za(c, b);
  try {
    return await Promise.race([a, d]);
  } finally {
    clearTimeout(e);
  }
}
;async function $a(a = []) {
  a = (Array.isArray(a) ? a : [a]).map(ab);
  return await Promise.all(a);
}
const ab = async a => {
  if ("function" != (typeof a).toLowerCase()) {
    return a;
  }
  try {
    const b = {};
    await a.call(b);
    return b;
  } catch (b) {
    if (!/^Class constructor/.test(b.message)) {
      throw b;
    }
    a = new a;
    a._init && await a._init();
    return new Proxy(a, {get(c, d) {
      return "then" == d ? c : "function" == typeof c[d] ? c[d].bind(c) : c[d];
    }});
  }
}, O = async a => {
  a = a.map(async b => {
    if ("function" == (typeof b._destroy).toLowerCase()) {
      return await b._destroy();
    }
  });
  return await Promise.all(a);
};
const cb = async a => {
  const {context:b, timeout:c = null, fn:d, h:e} = a;
  a = new Date;
  let h = null, f = null, g = null, k = [], m, l;
  try {
    b && (m = b ? $a(b) : Promise.resolve([]), m.then(() => {
      l = !0;
    }), k = await (c ? N(m, c, "Evaluate context") : m));
    const n = e ? [...Array.isArray(e) ? e : [e], ...k] : k, q = d(...n);
    q instanceof Promise ? f = await (c ? N(q, c, "Test") : q) : f = q;
  } catch (n) {
    h = n;
  }
  try {
    const n = O(k);
    g = await (c ? N(n, c, "Destroy") : n);
  } catch (n) {
    h = n;
  }
  !l && m && bb(m);
  return {started:a, finished:new Date, error:h, result:f, destroyResult:g};
}, bb = async a => {
  a = await a;
  await O(a);
};
const db = async(a, b) => {
  const {onlyFocused:c = !1, runTest:d, runTestSuite:e} = b, h = !c;
  return await a.reduce(async(f, g) => {
    const {name:k, isFocused:m, fn:l, hasFocused:n} = g;
    if (h || m || n) {
      if (f = f instanceof Promise ? await f : f, l) {
        const q = await d(g);
        Object.assign(g, q);
        f[k] = g;
      } else {
        g = await e(g, n), f[k] = g;
      }
    }
    return f;
  }, {});
};
function eb(a, b, c) {
  return setTimeout(() => {
    const d = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    d.stack = `Error: ${d.message}`;
    c(d);
  }, b);
}
function fb(a, b) {
  let c;
  const d = new Promise((e, h) => {
    c = eb(a, b, h);
  });
  return {timeout:c, i:d};
}
async function P(a, b, c) {
  if (!(a instanceof Promise)) {
    throw Error("Promise expected");
  }
  if (!b) {
    throw Error("Timeout must be a number");
  }
  if (0 > b) {
    throw Error("Timeout cannot be negative");
  }
  const {i:d, timeout:e} = fb(c, b);
  try {
    return await Promise.race([a, d]);
  } finally {
    clearTimeout(e);
  }
}
;const {deepStrictEqual:gb, equal:hb} = assert;
const {createInterface:ib} = readline;
function jb(a, b) {
  var c = b = void 0 === b ? {} : b, d = Object.assign({}, c);
  b = c.timeout;
  var e = void 0 === c.password ? !1 : c.password, h = void 0 === c.output ? process.stdout : c.output;
  c = void 0 === c.input ? process.stdin : c.input;
  d = (delete d.timeout, delete d.password, delete d.output, delete d.input, d);
  h = ib(Object.assign({}, {input:c, output:h}, d));
  if (e) {
    const f = h.output;
    h._writeToOutput = g => {
      if (["\r\n", "\n", "\r"].includes(g)) {
        return f.write(g);
      }
      g = g.split(a);
      "2" == g.length ? (f.write(a), f.write("*".repeat(g[1].length))) : f.write("*");
    };
  }
  e = new Promise(h.question.bind(h, a));
  b = b ? P(e, b, `reloquent: ${a}`) : e;
  h.promise = kb(b, h);
  return h;
}
const kb = async(a, b) => {
  try {
    return await a;
  } finally {
    b.close();
  }
};
async function lb(a, b) {
  if ("object" != typeof a) {
    throw Error("Please give an object with questions");
  }
  return await Object.keys(a).reduce(async(c, d) => {
    c = await c;
    var e = a[d];
    switch(typeof e) {
      case "object":
        e = Object.assign({}, e);
        break;
      case "string":
        e = {text:e};
        break;
      default:
        throw Error("A question must be a string or an object.");
    }
    e.text = `${e.text}${e.text.endsWith("?") ? "" : ":"} `;
    var h;
    if (e.defaultValue) {
      var f = e.defaultValue;
    }
    e.getDefault && (h = await e.getDefault());
    let g = f || "";
    f && h && f != h ? g = `\x1b[90m${f}\x1b[0m` : f && f == h && (g = "");
    f = h || "";
    ({promise:f} = jb(`${e.text}${g ? `[${g}] ` : ""}${f ? `[${f}] ` : ""}`, {timeout:b, password:e.password}));
    h = await f || h || e.defaultValue;
    "function" == typeof e.validation && e.validation(h);
    "function" == typeof e.postProcess && (h = await e.postProcess(h));
    return Object.assign({}, c, {[d]:h});
  }, {});
}
;async function Q(a) {
  const {defaultYes:b = !0, timeout:c} = {}, d = a.endsWith("?");
  ({question:a} = await lb({question:{text:`${d ? a.replace(/\?$/, "") : a} (y/n)${d ? "?" : ""}`, defaultValue:b ? "y" : "n"}}, c));
  return "y" == a;
}
;const {inspect:mb} = util;
const R = (...a) => {
  let b = -1;
  return "%s%s".replace(/%s/g, () => {
    b++;
    return a[b];
  });
};
function nb(a, b) {
  let c = 0;
  const d = (f, g = void 0) => {
    const k = " ".repeat(2 * c);
    g = void 0 !== g ? J("+ " + S(g), "green") : null;
    f = void 0 !== f ? J("- " + S(f), "red") : null;
    const m = [];
    f && m.push(R(k, f));
    g && m.push(R(k, g));
    return m.join("\n");
  }, e = f => {
    const g = " ".repeat(2 * c);
    return R(g, f);
  }, h = (f, g) => {
    if (f instanceof Date && g instanceof Date) {
      var k = f.getTime() != g.getTime() ? !1 : void 0;
      return k ? "" : d(f, g);
    }
    if (f instanceof Date && !(g instanceof Date) || !(f instanceof Date) && g instanceof Date || Array.isArray(f) && !Array.isArray(g) || !Array.isArray(f) && Array.isArray(g)) {
      return d(f, g);
    }
    if (T(f) && T(g) || !T(f) && T(g) || T(f) && !T(g)) {
      return f != g ? d(f, g) : "";
    }
    if (f.constructor && !g.constructor) {
      return d(f.constructor.name, g);
    }
    if (!f.constructor && g.constructor) {
      return d(f, g.constructor.name);
    }
    if (f.constructor && g.constructor) {
      if (f.constructor.name != g.constructor.name) {
        return d(f.constructor.name, g.constructor.name);
      }
      k = f.valueOf();
      var m = g.valueOf();
      if (T(k) && T(m) && k != m) {
        return d(k, m);
      }
    }
    if (Array.isArray(f) && Array.isArray(g)) {
      let l;
      k = f.map((n, q) => {
        l = q;
        (n = h(n, g[q])) && (n = `${e(`[${q}]`)}\n${n}`);
        return n;
      }).filter(Boolean);
      m = g.slice(l + 1).map((n, q) => `${e(`[${l + q + 1}]`)}\n${d(void 0, n)}`);
      return [...k, ...m].join("\n");
    }
    if ("object" == typeof f && "object" == typeof g) {
      const l = [], n = [], q = [];
      Object.keys(f).forEach(p => {
        p in g ? q.push(p) : n.push(p);
      });
      Object.keys(g).forEach(p => {
        p in f || l.push(p);
      });
      k = n.map(p => {
        let u = S(f[p]);
        return d(`${p}${`: ${u}`}`);
      });
      m = l.map(p => d(void 0, `${p}: ${S(g[p])}`));
      const r = q.map(p => {
        c++;
        const u = h(f[p], g[p]);
        let E = "";
        u && (E += e(Array.isArray(f[p]) && Array.isArray(g[p]) ? `${p}.Array` : p), E += "\n" + u);
        c--;
        return E;
      }).filter(Boolean);
      return [...k, ...m, ...r].join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", f, g);
  };
  return h(a, b);
}
const T = a => null === a ? !0 : "string number boolean symbol null undefined".split(" ").includes(typeof a), S = a => Array.isArray(a) ? `Array[${a.toString()}]` : a && a.toString ? a.toString() : `${a}`;
async function ob(a) {
  a = sa(a);
  return await Ha(a);
}
;async function pb(a, b) {
  if (!a) {
    throw Error("No path is given.");
  }
  const c = I(!0), d = ta(a);
  await new Promise((e, h) => {
    d.on("error", f => {
      f = c(f);
      h(f);
    }).on("close", e).end(b);
  });
}
;async function qb(a) {
  const b = A(a);
  try {
    return await U(b), a;
  } catch (c) {
    if (/EEXIST/.test(c.message) && -1 != c.message.indexOf(b)) {
      return a;
    }
    throw c;
  }
}
async function U(a) {
  try {
    await M(ua, a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = A(a);
      await U(c);
      await U(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;const rb = (a, b) => {
  a = " ".repeat(Math.max(a - b.length, 0));
  return `${b}${a}`;
}, sb = a => {
  var {width:b} = {};
  a = a.split("\n");
  b = b || a.reduce((c, {length:d}) => d > c ? d : c, 0);
  return a.map(rb.bind(null, b)).join("\n");
};
function tb(a) {
  const {padding:b = 1} = {};
  var c = a.split("\n").reduce((h, {length:f}) => f > h ? f : h, 0) + 2 * b;
  const d = `\u250c${"\u2500".repeat(c)}\u2510`;
  c = `\u2514${"\u2500".repeat(c)}\u2518`;
  const e = " ".repeat(b);
  a = sb(a).split("\n").map(h => `\u2502${e}${h}${e}\u2502`).join("\n");
  return `${d}\n${a}\n${c}`;
}
;async function V(a, b, c) {
  a = C(a.a, b);
  await qb(a);
  /\.json$/.test(a) ? (c = JSON.stringify(c, null, 2), await pb(a, c)) : await pb(a, c);
}
async function ub(a, b, c, d) {
  if (!c) {
    throw Error("Give snapshot to save");
  }
  if (await a.prompt(c, d)) {
    await V(a, b, c);
  } else {
    throw Error("Could not test missing snapshot");
  }
}
async function vb(a, b, c, d, e = !1) {
  if (!c) {
    throw Error("Pass the actual value for snapshot.");
  }
  const h = I(!0), f = /\.json$/.test(b);
  let g;
  try {
    if (g = await a.read(b), f) {
      var k = g;
      try {
        gb(c, k, void 0);
      } catch (l) {
        const n = nb(k, c);
        l.message = [l.message, n].filter(Boolean).join("\n");
        throw l;
      }
    } else {
      hb(c, g);
    }
  } catch (l) {
    if ("ENOENT" == l.code) {
      await ub(a, b, c, d);
    } else {
      var m;
      f || (m = Qa(g, c));
      if (e && (f ? console.log(l.message) : console.log(m), await Q(`Update snapshot${d ? ` for ${d}` : ""}?`))) {
        await V(a, b, c);
        return;
      }
      if (!f) {
        throw !e && console.log(m), a = h("The string didn't match the snapshot."), a.K = m, a;
      }
      throw h(l);
    }
  }
}
class wb {
  constructor() {
    this.a = "test/snapshot";
  }
  async prompt(a, b) {
    if ("string" == typeof a) {
      let c = a.split("\n").reduce((d, e) => {
        if (e.length > d) {
          return e.length;
        }
      }, 0);
      process.stdout.isTTY && process.stdout.columns - 4 >= c ? console.log(tb(a)) : console.log(a);
    } else {
      console.log(mb(a, {colors:!0}));
    }
    return await Q(`Save snapshot${b ? ` for ${b}` : ""}?`);
  }
  async read(a) {
    a = C(this.a, a);
    return /\.json$/.test(a) ? (a = await ob(a), JSON.parse(a)) : await ob(a);
  }
}
;const W = async a => {
  try {
    return await M(D, a);
  } catch (b) {
    return null;
  }
};
async function xb(a, b) {
  b = b.map(async c => {
    const d = B(a, c);
    return {lstat:await M(D, d), path:d, relativePath:c};
  });
  return await Promise.all(b);
}
const yb = a => a.lstat.isDirectory(), zb = a => !a.lstat.isDirectory();
async function Ab(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  if (!(await M(D, a)).isDirectory()) {
    throw a = Error("Path is not a directory"), a.code = "ENOTDIR", a;
  }
  var b = await M(F, a);
  b = await xb(a, b);
  a = b.filter(yb);
  b = b.filter(zb).reduce((c, d) => {
    var e = d.lstat.isDirectory() ? "Directory" : d.lstat.isFile() ? "File" : d.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return Object.assign({}, c, {[d.relativePath]:{type:e}});
  }, {});
  a = await a.reduce(async(c, d) => {
    var {path:e, relativePath:h} = d;
    c = await c;
    d = await Ab(e);
    return Object.assign({}, c, {[h]:d});
  }, {});
  return {content:Object.assign({}, b, a), type:"Directory"};
}
;const Bb = async a => {
  await M(xa, a);
}, Cb = async a => {
  const {content:b} = await Ab(a);
  var c = Object.keys(b).filter(e => {
    ({type:e} = b[e]);
    if ("File" == e || "SymbolicLink" == e) {
      return !0;
    }
  }), d = Object.keys(b).filter(e => {
    ({type:e} = b[e]);
    if ("Directory" == e) {
      return !0;
    }
  });
  c = c.map(e => B(a, e));
  await Promise.all(c.map(Bb));
  d = d.map(e => B(a, e));
  await Promise.all(d.map(Cb));
  await M(va, a);
}, Db = async a => {
  (await M(D, a)).isDirectory() ? await Cb(a) : await Bb(a);
};
const Eb = async(a, b, c, d = "", e = [], h = !1, f = "txt") => {
  var g = b.replace(/^!/, "");
  const k = g.replace(/ /g, "-");
  a instanceof Aa && (a = await Ha(a));
  b = "string" == typeof a;
  const m = `${k}.${b ? f : "json"}`;
  let l = B(...c);
  (c = e.find(n => {
    n = B(...n.split("/"));
    return l.startsWith(n);
  })) && (l = l.slice(c.length));
  e = B(d, l);
  d = B(e, m);
  if (a) {
    if (c = new wb, c.a = e, f = B(e, `${k}.${b ? "json" : f}`), await W(f)) {
      g = `Snapshot of another type exists: ${J(f, "red")}`, h || X(g), console.log("%s.\nNew data:", g), console.log(b ? a : mb(a, {colors:!0})), await Q(`Update snapshot ${J(f, "yellow")} to a new type?`) || X(g), await V(c, m, a), await Db(f);
    } else {
      try {
        await vb(c, m, a, J(g, "yellow"), h);
      } catch (n) {
        "The string didn't match the snapshot." == n.message && (n.message = `The string didn't match the snapshot ${J(d, "yellow")}`), X(n);
      }
    }
  } else {
    a = await W(d), a || (d = d.replace(/json$/, f), a = await W(d)), a && X(`Snapshot ${d} exists, but the test did not return anything.`);
  }
}, X = a => {
  a = Error(a);
  a.stack = a.message;
  throw a;
};
const Y = require("../");
async function Fb(a, b, {name:c, context:d, fn:e, timeout:h, h:f}, g = {}, k = null) {
  a && a({name:c, type:"test-start"});
  let m, l;
  d = Array.isArray(d) ? d : [d];
  d.forEach(r => {
    r.prototype instanceof Y && (m = r.snapshotExtension);
  });
  d = (e.name ? d.slice(0, e.length) : d).map(r => {
    try {
      return r === Y || r.prototype instanceof Y ? {["snapshotExtension"](p) {
        m = p;
      }, ["snapshotSource"](p, u) {
        l = p;
        u && (m = u);
      }} : r;
    } catch (p) {
      return r;
    }
  });
  let n;
  const q = r => {
    k = r;
  };
  if (!k) {
    process.once("uncaughtException", q);
    process.once("unhandledRejection", q);
    try {
      n = await cb({context:d, h:f, fn:e, timeout:h});
      let {result:r, error:p} = n;
      k || (k = p);
      try {
        await Eb(r, l || c, b, g.m, g.o, g.j, m);
      } catch (u) {
        k = u;
      }
      if (g.j && p && p.handleUpdate) {
        try {
          await p.handleUpdate() && (k = null);
        } catch (u) {
          k = u;
        }
      }
    } finally {
      process.removeListener("uncaughtException", q), process.removeListener("unhandledRejection", q);
    }
  }
  a && a({name:c, error:k, type:"test-end", result:Gb({error:k, name:c})});
  return n;
}
function Gb({error:a, name:b}) {
  return null === a ? `${Sa} ${b}` : `${Ta} ${b}` + t + L(Ra({error:a, name:b}), " | ");
}
async function Hb(a, b, {name:c, tests:d, h:e}, h, f, g) {
  a && a({type:"test-suite-start", name:c});
  let k, m;
  if (e && !g) {
    try {
      k = await Ib(e), Jb(d, k);
    } catch (l) {
      l.message = `Persistent context failed to evaluate: ${l.message}`, l.stack = l.stack.split("\n", 2).join("\n"), g = l;
    }
  }
  try {
    const l = [...b, c.replace(/\.jsx?$/, "")];
    m = await Kb(a, l, d, h, f, g);
    a && a({type:"test-suite-end", name:c});
  } finally {
    if (k) {
      try {
        await Lb(k);
      } catch (l) {
        l.stack = l.stack.split("\n", 2).join("\n"), console.log(J(l.stack, "red"));
      }
    }
  }
  return m;
}
const Jb = (a, b) => {
  a.forEach(c => {
    c.h = b;
  });
}, Mb = async a => {
  const b = ab(a);
  return await P(b, a.u || 5000, `Evaluate persistent context ${a.name ? a.name : ""}`);
}, Ib = async a => {
  a = Array.isArray(a) ? a : [a];
  return await Promise.all(a.map(b => Mb(b)));
}, Nb = async a => {
  const b = O([a]);
  return await P(b, a.u || 5000, `Destroy persistent context ${a.name ? a.name : ""}`);
}, Lb = async a => await Promise.all(a.map(b => Nb(b)));
async function Kb(a, b, c, d, e, h) {
  return await db(c, {onlyFocused:d, runTest(f) {
    return Fb(a, b, f, e, h);
  }, runTestSuite(f, g) {
    return Hb(a, b, f, d ? g : !1, e, h);
  }});
}
;class Ob {
  constructor(a, b, c = 2000, d = []) {
    this.timeout = c;
    this.name = a;
    this.fn = b;
    this.context = d;
    this.error = this.h = null;
  }
  get isFocused() {
    return this.name.startsWith("!");
  }
}
;function Pb(a) {
  ({v:a} = a);
  return a instanceof Z;
}
const Qb = a => a.some(b => b.startsWith("!")), Rb = a => a.reduce((b, c) => c instanceof Z ? [...b, c.name, ...c.H] : [...b, c.name], []);
function Sb(a, b) {
  if (Array.isArray(b) || "function" == (typeof b).toLowerCase()) {
    return a.a = b, !0;
  }
  if ("object" == (typeof b).toLowerCase()) {
    return b = Object.assign({}, a.a || {}, b), a.a = Object.freeze(b), !0;
  }
}
class Z {
  constructor(a, b, c, d, e) {
    if (!a) {
      throw Error("Test suite name must be given.");
    }
    this.I = a;
    this.J = c;
    this.u = e || (Pb(this) ? this.v.timeout : void 0);
    this.a = this.A = void 0;
    !Sb(this, d) && Pb(this) && (this.a = c.context);
    if ("object" != typeof b) {
      throw Error("You must provide tests in an object.");
    }
    this.B = !1;
    this.s = [];
    this.w = [];
    c = Object.assign({}, b);
    a = b.context;
    b = b.persistentContext;
    c = (delete c.context, delete c.persistentContext, c);
    void 0 !== a && Sb(this, a);
    void 0 !== b && (Array.isArray(b) ? this.A = b : "function" == (typeof b).toLowerCase() && (this.A = b));
    this.s = Tb(c, this);
    this.w = Rb(this.s);
    this.B = Qb(this.w);
  }
  get name() {
    return this.I;
  }
  get v() {
    return this.J;
  }
  get tests() {
    return this.s;
  }
  get context() {
    return this.a;
  }
  get timeout() {
    return this.u;
  }
  get hasFocused() {
    return this.B;
  }
  get H() {
    return this.w;
  }
  get isFocused() {
    return this.name.startsWith("!");
  }
  dump() {
    const a = this.name + t + this.tests.map(b => b.dump()).join("\n");
    return this.v ? L(a, "    ") : a;
  }
  get h() {
    return this.A;
  }
}
const Ub = (a, b) => {
  ({name:a} = a);
  ({name:b} = b);
  return "default" == a ? -1 : "default" == b ? 1 : 0;
};
function Vb(a) {
  const b = [], c = [];
  a.forEach(d => {
    d instanceof Ob ? c.push(d) : b.push(d);
  });
  a = b.sort(Ub);
  return [...c, ...a];
}
function Tb(a, b) {
  const c = Object.keys(a).map(d => {
    const e = a[d];
    if (e instanceof Z) {
      return e;
    }
    switch(typeof e) {
      case "function":
        return new Ob(d, e, b.timeout, b.context);
      case "object":
        return new Z(d, e, b);
    }
  }).filter(d => d);
  return Vb(c);
}
;function Wb() {
  Object.keys(require.cache).forEach(a => {
    ra("", a).startsWith("node_modules") || delete require.cache[a];
  });
}
const Yb = async(a, b) => {
  a = await a.reduce(async(c, d) => {
    c = await c;
    const e = await Xb(d);
    return e ? Object.assign({}, c, {[d]:e}) : c;
  }, {});
  return new Z("Zoroaster Root Test Suite", a, null, void 0, b);
};
async function Zb(a) {
  return (await M(F, a)).reduce(async(b, c) => {
    b = await b;
    const d = B(a, c), e = await M(D, d);
    let h;
    if (e.isFile()) {
      var f = C(d);
      f = require(f);
      h = c.replace(/\.jsx?$/, "");
    } else {
      e.isDirectory() && (f = await Zb(d), h = c);
    }
    return b[h] ? (console.warn("Merging %s with %s in %s", h, c, a), b[h] = $b(b[h], f), b) : Object.assign({}, b, {[h]:f});
  }, {});
}
const $b = (a, b) => {
  Object.keys(b).forEach(c => {
    if (a[c]) {
      throw Error(`Duplicate key ${c}`);
    }
  });
  return Object.assign({}, a, b);
};
async function Xb(a) {
  try {
    const b = await M(D, a);
    if (b.isFile()) {
      const c = C(a);
      return require(c);
    }
    if (b.isDirectory()) {
      return await Zb(a);
    }
  } catch (b) {
    throw b.message += `\n${J("Could not require ", "red") + K(J(a, "white"), "red")}`, b;
  }
}
;function ac(a, b) {
  a.forEach(c => {
    za(c, (...d) => {
      b(c, ...d);
    });
  });
}
function bc(a) {
  a.forEach(b => {
    ya(b);
  });
}
async function cc({paths:a, watch:b, timeout:c, m:d, o:e, j:h}, {C:f = [], G:g} = {}) {
  bc(f);
  g && process.removeListener("beforeExit", g);
  f = await Yb(a, c);
  const k = Ua();
  g = Wa();
  const m = Va();
  k.pipe(m).pipe(process.stdout);
  k.pipe(g);
  ({i:g} = new Ga({rs:g}));
  var l = 0, n = 0;
  await Kb(r => {
    "object" == typeof r && (k.write(r), "test-end" == r.type && (l++, r.error && n++));
  }, [], f.tests, f.hasFocused, {m:d, o:e, j:h});
  k.end();
  f = await g;
  process.stdout.write(t);
  process.stdout.write(f);
  process.stdout.write(`\ud83e\udd85  Executed ${l} test${1 == l ? "" : "s"}`);
  n && process.stdout.write(`: ${n} error${1 < n ? "s" : ""}`);
  process.stdout.write(`.${t}`);
  const q = () => {
    process.exit(n);
  };
  process.once("beforeExit", q);
  if (b) {
    const r = Object.keys(require.cache).filter(p => !p.startsWith(`${process.cwd()}/node_modules/`));
    ac(r, async(p, u) => {
      const E = a.filter(wa => C(wa) != p || u.mtime.getTime() ? !0 : (console.warn("Test suite file %s was deleted.", J(wa, "yellow")), !1));
      Wb();
      await cc({paths:E, watch:b, timeout:c, m:d, o:e, j:h}, {C:r, G:q});
    });
  }
}
;function dc() {
  const {usage:a = {}, description:b, line:c, example:d} = {usage:ec, description:"A testing framework with support for test contexts and masks.\nAutomatically transpiles import/export and JSX with \u00c0LaMode.\nhttps://artdecocode.com/zoroaster/", line:"zoroaster path [pathN] [-w] [-ab] [-sr] [-vh]", example:"zoroaster test/spec test/mask -a"};
  var e = Object.keys(a);
  const h = Object.values(a), [f] = e.reduce(([m = 0, l = 0], n) => {
    const q = a[n].split("\n").reduce((r, p) => p.length > r ? p.length : r, 0);
    q > l && (l = q);
    n.length > m && (m = n.length);
    return [m, l];
  }, []), g = (m, l) => {
    l = " ".repeat(l - m.length);
    return `${m}${l}`;
  };
  e = e.reduce((m, l, n) => {
    n = h[n].split("\n");
    l = g(l, f);
    const [q, ...r] = n;
    l = `${l}\t${q}`;
    const p = g("", f);
    n = r.map(u => `${p}\t${u}`);
    return [...m, l, ...n];
  }, []).map(m => `\t${m}`);
  const k = [b, `  ${c || ""}`].filter(m => m ? m.trim() : m).join("\n\n");
  e = `${k ? `${k}\n` : ""}
${e.join("\n")}
`;
  return d ? `${e}
  Example:

    ${d}
` : e;
}
;if (oa) {
  console.log(require("../../package.json").version), process.exit();
} else {
  if (pa) {
    var fc, ec = ea();
    fc = dc();
    console.log(fc);
    process.exit();
  }
}
if (ia) {
  try {
    require("@babel/register");
  } catch (a) {
    const b = C(process.cwd(), "node_modules/@babel/register");
    require(b);
  }
}
ha && require("alamode")();
(async() => {
  try {
    await cc({paths:[...fa || [], ...qa], watch:ja, timeout:ka, m:la, o:ma.split(","), j:na});
  } catch (a) {
    console.log(w(a.stack)), process.exit(1);
  }
})();


//# sourceMappingURL=zoroaster.js.map