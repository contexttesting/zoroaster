#!/usr/bin/env node
             
const path = require('path');
const os = require('os');
const fs = require('fs');
const stream = require('stream');
const util = require('util');
const assert = require('assert');
const readline = require('readline');             
const {EOL:u, homedir:aa} = os;
const w = /\s+at.*(?:\(|\s)(.*)\)?/, ba = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ca = aa(), x = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(ba.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(h => {
    h = h.match(w);
    if (null === h || !h[1]) {
      return !0;
    }
    h = h[1];
    return h.includes(".app/Contents/Resources/electron.asar") || h.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(h);
  }).filter(h => h.trim()).map(h => b ? h.replace(w, (f, g) => f.replace(g, g.replace(ca, "~"))) : h).join("\n");
};
const z = (a, b, c, d, e) => {
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
  var a = A;
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
const A = {tests:{description:"The location of the test suite directory or file.", command:!0, multiple:!0}, alamode:{description:"Enable import/export transpilation with \u00c0LaMode.", boolean:!0, short:"a"}, babel:{description:"Require `@babel/register` (needs to be installed).", boolean:!0, short:"b"}, watch:{description:"Start the runner in _watch_ mode (rerun on changes).", boolean:!0, short:"w"}, timeout:{description:"Timeout for tests in ms.", number:!0, default:"2000", short:"t"}, snapshot:{description:"The location of the snapshot dir.", 
default:"test/snapshot", short:"s"}, snapshotRoot:{description:"The list of folders that will be roots in the snapshot dir.", default:"test/spec,test/mask", short:"r"}, interactive:{description:"Run in interactive mode, allowing to update snapshots\nand mask results when they don't match currently expected.", boolean:!0, short:"i"}, version:{description:"Show the current version.", boolean:!0, short:"v"}, help:{description:"Display help information.", boolean:!0, short:"h"}}, B = function(a, b) {
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
      ({value:k, argv:e} = z(e, h, g));
    } else {
      try {
        const {short:m, boolean:l, number:n, command:p, multiple:r} = g;
        p && r && c.length ? (k = c, d = !0) : p && c.length ? (k = c[0], d = !0) : {value:k, argv:e} = z(e, h, m, l, n);
      } catch (m) {
        return Object.assign({}, {c:e}, f);
      }
    }
    return void 0 === k ? Object.assign({}, {c:e}, f) : Object.assign({}, {c:e}, f, {[h]:k});
  }, {c:b});
}(A), fa = B.tests, ha = B.alamode, ia = B.babel, ja = B.watch, ka = B.timeout || 2000, la = B.snapshot || "test/snapshot", ma = B.snapshotRoot || "test/spec,test/mask", na = B.interactive, oa = B.version, pa = B.help, qa = B.c;
const {dirname:C, join:D, relative:ra, resolve:E} = path;
const {createReadStream:sa, createWriteStream:ta, lstat:F, mkdir:ua, readdir:G, rmdir:va, unlink:wa, unwatchFile:xa, watchFile:ya} = fs;
var za = stream;
const {Transform:H, Writable:Aa} = stream;
const Ba = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, Ca = (a, b = !1) => Ba(a, 2 + (b ? 1 : 0)), Da = a => {
  ({callee:{caller:a}} = a);
  return a;
};
function Ea(a, b, c = !1) {
  return function(d) {
    var e = Da(arguments), {stack:h} = Error();
    const f = Ba(h, 2, !0), g = (h = d instanceof Error) ? d.message : d;
    e = [`Error: ${g}`, ...null !== e && a === e || c ? [b] : [f, b]].join("\n");
    e = x(e);
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
class J extends Aa {
  constructor(a) {
    var b = a || {}, c = Object.assign({}, b);
    const d = void 0 === b.binary ? !1 : b.binary, e = void 0 === b.rs ? null : b.rs;
    b = (delete c.binary, delete c.rs, c);
    const {D:h = I(!0), proxyError:f} = a || {}, g = (k, m) => h(m);
    super(b);
    this.a = [];
    this.C = new Promise((k, m) => {
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
          const n = x(l.stack);
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
    return this.C;
  }
}
const Ga = async a => {
  var b = void 0 === b ? {} : b;
  ({i:a} = new J(Object.assign({}, {rs:a}, b, {D:I(!0)})));
  return await a;
};
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function Ha(a, b, c) {
  let d = a[a.length - 1];
  d && d.f === b && d.j === c ? a[a.length - 1] = {count:d.count + 1, f:b, j:c} : a.push({count:1, f:b, j:c});
}
function Ia(a, b, c, d, e) {
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
function Ja(a) {
  let b = [];
  for (let c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
function Ka(a, b) {
  var c = new La;
  a = Ja(a.split(""));
  b = Ja(b.split(""));
  let d = b.length, e = a.length, h = 1, f = d + e, g = [{b:-1, g:[]}];
  var k = Ia(c, g[0], b, a, 0);
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
        let p = m && m.b + 1 < d;
        l = n && 0 <= l && l < e;
        if (p || l) {
          !p || l && m.b < n.b ? (m = {b:n.b, g:n.g.slice(0)}, Ha(m.g, void 0, !0)) : (m.b++, Ha(m.g, !0, void 0));
          l = Ia(c, m, b, a, k);
          if (m.b + 1 >= d && l + 1 >= e) {
            k = Ma(c, m.g, b, a);
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
class La {
  equals(a, b) {
    return a === b;
  }
  join(a) {
    return a.join("");
  }
}
function Ma(a, b, c, d) {
  let e = 0, h = b.length, f = 0, g = 0;
  for (; e < h; e++) {
    var k = b[e];
    if (k.j) {
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
  1 < h && "string" === typeof c.value && (c.f || c.j) && a.equals("", c.value) && (b[h - 2].value += c.value, b.pop());
  return b;
}
;const Na = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, Oa = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function K(a, b) {
  return (b = Na[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function L(a, b) {
  return (b = Oa[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function Pa(a, b) {
  return Ka(a, b).map(({f:c, j:d, value:e}) => {
    const h = e.split(" ");
    return c ? h.map(f => f.replace(/\n$/mg, "\u23ce\n")).map(f => K(f, "green")).join(L(" ", "green")) : d ? h.map(f => f.replace(/\n$/mg, "\u23ce\n")).map(f => K(f, "red")).join(L(" ", "red")) : K(e, "grey");
  }).join("");
}
;function M(a, b) {
  return a.replace(/^(?!\s*$)/mg, b);
}
function Qa({error:a, name:b}) {
  if (!a) {
    throw Error("cannot filter stack when a test does not have an error");
  }
  var c = a.stack.split("\n");
  const d = new RegExp(`at (.+\\.)?${b}`);
  b = c.findIndex(e => d.test(e)) + 1;
  c = c.slice(0, b).join("\n");
  return (c ? c : x(a.stack)).replace(/\n/g, u);
}
const Ra = " " + K("\u2713", "green") + " ", Sa = " " + K("\u2717", "red") + " ";
function Ta() {
  const a = [];
  return new H({objectMode:!0, transform(b, c, d) {
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
function Ua() {
  return new H({objectMode:!0, transform(a, b, c) {
    var {type:d, name:e, stack:h, result:f} = a;
    "test-suite-start" == d && "default" != e ? (this.push(M(e, Array.from({length:2 * h.length}).join(" "))), this.push(u)) : "test-end" == d && (this.push(M(f, Array.from({length:2 * h.length}).join(" "))), this.push(u));
    c();
  }});
}
function Va() {
  return new H({objectMode:!0, transform(a, b, c) {
    var {error:d, stack:e, name:h} = a;
    if (!d) {
      return c();
    }
    this.push("\u001b[31m");
    this.push(e.join(" > "));
    this.push(` > ${h}`);
    this.push("\u001b[0m");
    this.push(u);
    this.push(M(Qa({error:d, name:h}), "  "));
    this.push(u);
    this.push(u);
    c();
  }});
}
;function Wa(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function N(a, b, c) {
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
      Wa(e, l);
    }), k = [...b, g]) : 1 < Array.from(arguments).length && (Wa(e, 0), k = [b, g]);
    a(...k);
  });
}
;function Xa(a, b, c) {
  return setTimeout(() => {
    const d = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    d.stack = `Error: ${d.message}`;
    c(d);
  }, b);
}
function Ya(a, b) {
  let c;
  const d = new Promise((e, h) => {
    c = Xa(a, b, h);
  });
  return {timeout:c, i:d};
}
async function O(a, b, c) {
  if (!(a instanceof Promise)) {
    throw Error("Promise expected");
  }
  if (!b) {
    throw Error("Timeout must be a number");
  }
  if (0 > b) {
    throw Error("Timeout cannot be negative");
  }
  const {i:d, timeout:e} = Ya(c, b);
  try {
    return await Promise.race([a, d]);
  } finally {
    clearTimeout(e);
  }
}
;async function Za(a = []) {
  a = (Array.isArray(a) ? a : [a]).map($a);
  return await Promise.all(a);
}
const $a = async a => {
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
}, P = async a => {
  a = a.map(async b => {
    if ("function" == (typeof b._destroy).toLowerCase()) {
      return await b._destroy();
    }
  });
  return await Promise.all(a);
};
const bb = async a => {
  const {context:b, timeout:c = null, fn:d, persistentContext:e, onCatchment:h} = a;
  a = new Date;
  let f = null, g = null, k = null, m = [], l, n;
  try {
    b && (l = b ? Za(b) : Promise.resolve([]), l.then(() => {
      n = !0;
    }), m = await (c ? O(l, c, "Evaluate context") : l));
    const p = e ? [...Array.isArray(e) ? e : [e], ...m] : m, r = d(...p);
    r instanceof Promise ? g = await (c ? O(r, c, "Test") : r) : g = r;
  } catch (p) {
    f = p;
  }
  if (g instanceof za) {
    try {
      const p = new J({rs:g});
      h && h(p);
      g = await p.i;
    } catch (p) {
      f = p;
    }
  }
  try {
    const p = P(m);
    k = await (c ? O(p, c, "Destroy") : p);
  } catch (p) {
    f = p;
  }
  !n && l && ab(l);
  return {started:a, finished:new Date, error:f, result:g, destroyResult:k};
}, ab = async a => {
  a = await a;
  await P(a);
};
const cb = async(a, b) => {
  const {onlyFocused:c = !1, runTest:d, runTestSuite:e} = b, h = !c;
  return await a.reduce(async(f, g) => {
    const {name:k, isFocused:m, fn:l, hasFocused:n} = g;
    if (h || m || n) {
      if (f = f instanceof Promise ? await f : f, l) {
        const p = await d(g);
        Object.assign(g, p);
        f[k] = g;
      } else {
        g = await e(g, n), f[k] = g;
      }
    }
    return f;
  }, {});
};
const {deepStrictEqual:db, equal:eb} = assert;
const {createInterface:fb} = readline;
function gb(a, b) {
  var c = b = void 0 === b ? {} : b, d = Object.assign({}, c);
  b = c.timeout;
  var e = void 0 === c.password ? !1 : c.password, h = void 0 === c.output ? process.stdout : c.output;
  c = void 0 === c.input ? process.stdin : c.input;
  d = (delete d.timeout, delete d.password, delete d.output, delete d.input, d);
  h = fb(Object.assign({}, {input:c, output:h}, d));
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
  b = b ? O(e, b, `reloquent: ${a}`) : e;
  h.promise = hb(b, h);
  return h;
}
const hb = async(a, b) => {
  try {
    return await a;
  } finally {
    b.close();
  }
};
async function ib(a, b) {
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
    ({promise:f} = gb(`${e.text}${g ? `[${g}] ` : ""}${f ? `[${f}] ` : ""}`, {timeout:b, password:e.password}));
    h = await f || h || e.defaultValue;
    "function" == typeof e.validation && e.validation(h);
    "function" == typeof e.postProcess && (h = await e.postProcess(h));
    return Object.assign({}, c, {[d]:h});
  }, {});
}
;async function Q(a) {
  const {defaultYes:b = !0, timeout:c} = {}, d = a.endsWith("?");
  ({question:a} = await ib({question:{text:`${d ? a.replace(/\?$/, "") : a} (y/n)${d ? "?" : ""}`, defaultValue:b ? "y" : "n"}}, c));
  return "y" == a;
}
;const {inspect:jb} = util;
const R = (...a) => {
  let b = -1;
  return "%s%s".replace(/%s/g, () => {
    b++;
    return a[b];
  });
};
function kb(a, b) {
  let c = 0;
  const d = (f, g = void 0) => {
    const k = " ".repeat(2 * c);
    g = void 0 !== g ? K("+ " + S(g), "green") : null;
    f = void 0 !== f ? K("- " + S(f), "red") : null;
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
      k = f.map((n, p) => {
        l = p;
        (n = h(n, g[p])) && (n = `${e(`[${p}]`)}\n${n}`);
        return n;
      }).filter(Boolean);
      m = g.slice(l + 1).map((n, p) => `${e(`[${l + p + 1}]`)}\n${d(void 0, n)}`);
      return [...k, ...m].join("\n");
    }
    if ("object" == typeof f && "object" == typeof g) {
      const l = [], n = [], p = [];
      Object.keys(f).forEach(q => {
        q in g ? p.push(q) : n.push(q);
      });
      Object.keys(g).forEach(q => {
        q in f || l.push(q);
      });
      k = n.map(q => {
        let t = S(f[q]);
        return d(`${q}${`: ${t}`}`);
      });
      m = l.map(q => d(void 0, `${q}: ${S(g[q])}`));
      const r = p.map(q => {
        c++;
        const t = h(f[q], g[q]);
        let v = "";
        t && (v += e(Array.isArray(f[q]) && Array.isArray(g[q]) ? `${q}.Array` : q), v += "\n" + t);
        c--;
        return v;
      }).filter(Boolean);
      return [...k, ...m, ...r].join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", f, g);
  };
  return h(a, b);
}
const T = a => null === a ? !0 : "string number boolean symbol null undefined".split(" ").includes(typeof a), S = a => Array.isArray(a) ? `Array[${a.toString()}]` : a && a.toString ? a.toString() : `${a}`;
async function lb(a) {
  a = sa(a);
  return await Ga(a);
}
;async function mb(a, b) {
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
;async function nb(a) {
  const b = C(a);
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
    await N(ua, a);
  } catch (b) {
    if ("ENOENT" == b.code) {
      const c = C(a);
      await U(c);
      await U(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;const ob = (a, b) => {
  a = " ".repeat(Math.max(a - b.length, 0));
  return `${b}${a}`;
}, pb = a => {
  var {width:b} = {};
  a = a.split("\n");
  b = b || a.reduce((c, {length:d}) => d > c ? d : c, 0);
  return a.map(ob.bind(null, b)).join("\n");
};
function qb(a) {
  const {padding:b = 1} = {};
  var c = a.split("\n").reduce((h, {length:f}) => f > h ? f : h, 0) + 2 * b;
  const d = `\u250c${"\u2500".repeat(c)}\u2510`;
  c = `\u2514${"\u2500".repeat(c)}\u2518`;
  const e = " ".repeat(b);
  a = pb(a).split("\n").map(h => `\u2502${e}${h}${e}\u2502`).join("\n");
  return `${d}\n${a}\n${c}`;
}
;async function V(a, b, c) {
  a = E(a.a, b);
  await nb(a);
  /\.json$/.test(a) ? (c = JSON.stringify(c, null, 2), await mb(a, c)) : await mb(a, c);
}
async function rb(a, b, c, d) {
  if (!c) {
    throw Error("Give snapshot to save");
  }
  if (await a.prompt(c, d)) {
    await V(a, b, c);
  } else {
    throw Error("Could not test missing snapshot");
  }
}
async function sb(a, b, c, d, e = !1) {
  if (!c) {
    throw Error("Pass the actual value for snapshot.");
  }
  const h = I(!0), f = /\.json$/.test(b);
  let g;
  try {
    if (g = await a.read(b), f) {
      var k = g;
      try {
        db(c, k, void 0);
      } catch (l) {
        const n = kb(k, c);
        l.message = [l.message, n].filter(Boolean).join("\n");
        throw l;
      }
    } else {
      eb(c, g);
    }
  } catch (l) {
    if ("ENOENT" == l.code) {
      await rb(a, b, c, d);
    } else {
      var m;
      f || (m = Pa(g, c));
      if (e && (f ? console.log(l.message) : console.log(m), await Q(`Update snapshot${d ? ` for ${d}` : ""}?`))) {
        await V(a, b, c);
        return;
      }
      if (!f) {
        throw !e && console.log(m), a = h("The string didn't match the snapshot."), a.J = m, a;
      }
      throw h(l);
    }
  }
}
class tb {
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
      process.stdout.isTTY && process.stdout.columns - 4 >= c ? console.log(qb(a)) : console.log(a);
    } else {
      console.log(jb(a, {colors:!0}));
    }
    return await Q(`Save snapshot${b ? ` for ${b}` : ""}?`);
  }
  async read(a) {
    a = E(this.a, a);
    return /\.json$/.test(a) ? (a = await lb(a), JSON.parse(a)) : await lb(a);
  }
}
;const W = async a => {
  try {
    return await N(F, a);
  } catch (b) {
    return null;
  }
};
async function ub(a, b) {
  b = b.map(async c => {
    const d = D(a, c);
    return {lstat:await N(F, d), path:d, relativePath:c};
  });
  return await Promise.all(b);
}
const vb = a => a.lstat.isDirectory(), wb = a => !a.lstat.isDirectory();
async function xb(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  if (!(await N(F, a)).isDirectory()) {
    throw a = Error("Path is not a directory"), a.code = "ENOTDIR", a;
  }
  var b = await N(G, a);
  b = await ub(a, b);
  a = b.filter(vb);
  b = b.filter(wb).reduce((c, d) => {
    var e = d.lstat.isDirectory() ? "Directory" : d.lstat.isFile() ? "File" : d.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return Object.assign({}, c, {[d.relativePath]:{type:e}});
  }, {});
  a = await a.reduce(async(c, d) => {
    var {path:e, relativePath:h} = d;
    c = await c;
    d = await xb(e);
    return Object.assign({}, c, {[h]:d});
  }, {});
  return {content:Object.assign({}, b, a), type:"Directory"};
}
;const yb = async a => {
  await N(wa, a);
}, zb = async a => {
  const {content:b} = await xb(a);
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
  c = c.map(e => D(a, e));
  await Promise.all(c.map(yb));
  d = d.map(e => D(a, e));
  await Promise.all(d.map(zb));
  await N(va, a);
}, Ab = async a => {
  (await N(F, a)).isDirectory() ? await zb(a) : await yb(a);
};
const Bb = a => a.replace(/^!/, ""), Cb = async(a, b, c, d = "", e = [], h = !1, f = "txt") => {
  var g = b.replace(/^!/, "");
  const k = g.replace(/ /g, "-");
  b = "string" == typeof a;
  const m = `${k}.${b ? f : "json"}`;
  let l = D(...c.map(Bb));
  (c = e.find(n => {
    n = D(...n.split("/"));
    return l.startsWith(n);
  })) && (l = l.slice(c.length));
  e = D(d, l);
  d = D(e, m);
  if (a) {
    if (c = new tb, c.a = e, f = D(e, `${k}.${b ? "json" : f}`), await W(f)) {
      g = `Snapshot of another type exists: ${K(f, "red")}`, h || X(g), console.log("%s.\nNew data:", g), console.log(b ? a : jb(a, {colors:!0})), await Q(`Update snapshot ${K(f, "yellow")} to a new type?`) || X(g), await V(c, m, a), await Ab(f);
    } else {
      try {
        await sb(c, m, a, K(g, "yellow"), h);
      } catch (n) {
        "The string didn't match the snapshot." == n.message && (n.message = `The string didn't match the snapshot ${K(d, "yellow")}`), X(n);
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
async function Db(a, b, {name:c, context:d, fn:e, timeout:h, persistentContext:f}, g = {}, k = null) {
  a && a({name:c, type:"test-start"});
  let m, l, n;
  d = Array.isArray(d) ? d : [d];
  d.forEach(t => {
    t.prototype instanceof Y && (m = t.snapshotExtension, n = t.serialise);
  });
  d = (e.name ? d.slice(0, e.length) : d).map(t => {
    try {
      return t === Y || t.prototype instanceof Y ? {["snapshotExtension"](v) {
        m = v;
      }, ["snapshotSource"](v, y) {
        l = v;
        y && (m = y);
      }} : t;
    } catch (v) {
      return t;
    }
  });
  let p, r;
  const q = t => {
    if (p) {
      return p.emit("error", t);
    }
    k = t;
  };
  if (!k) {
    process.once("uncaughtException", q);
    process.once("unhandledRejection", q);
    try {
      r = await bb({context:d, persistentContext:f, fn:e, timeout:h, onCatchment(y) {
        p = y;
      }});
      let {result:t, error:v} = r;
      k || (k = v);
      if (!k) {
        try {
          void 0 !== t && n && (t = n(t)), await Cb(t, l || c, b, g.l, g.m, g.h, m);
        } catch (y) {
          k = y;
        }
      }
      if (g.h && v && v.handleUpdate) {
        try {
          await v.handleUpdate() && (k = null);
        } catch (y) {
          k = y;
        }
      }
    } finally {
      process.removeListener("uncaughtException", q), process.removeListener("unhandledRejection", q);
    }
  }
  a && a({name:c, error:k, type:"test-end", result:Eb({error:k, name:c})});
  return r;
}
function Eb({error:a, name:b}) {
  return null === a ? `${Ra} ${b}` : `${Sa} ${b}` + u + M(Qa({error:a, name:b}), " | ");
}
async function Fb(a, b, {name:c, tests:d, persistentContext:e}, h, f, g) {
  a && a({type:"test-suite-start", name:c});
  let k, m;
  if (e && !g) {
    try {
      k = await Gb(e), Hb(d, k);
    } catch (l) {
      l.message = `Persistent context failed to evaluate: ${l.message}`, l.stack = l.stack.split("\n", 2).join("\n"), g = l;
    }
  }
  try {
    const l = [...b, c.replace(/\.jsx?$/, "")];
    m = await Ib(a, l, d, h, f, g);
    a && a({type:"test-suite-end", name:c});
  } finally {
    if (k) {
      try {
        await Jb(k);
      } catch (l) {
        l.stack = l.stack.split("\n", 2).join("\n"), console.log(K(l.stack, "red"));
      }
    }
  }
  return m;
}
const Hb = (a, b) => {
  a.forEach(c => {
    c.persistentContext = b;
  });
}, Kb = async a => {
  const b = $a(a);
  return await O(b, a.s || 5000, `Evaluate persistent context ${a.name ? a.name : ""}`);
}, Gb = async a => {
  a = Array.isArray(a) ? a : [a];
  return await Promise.all(a.map(b => Kb(b)));
}, Lb = async a => {
  const b = P([a]);
  return await O(b, a.s || 5000, `Destroy persistent context ${a.name ? a.name : ""}`);
}, Jb = async a => await Promise.all(a.map(b => Lb(b)));
async function Ib(a, b, c, d, e, h) {
  return await cb(c, {onlyFocused:d, runTest(f) {
    return Db(a, b, f, e, h);
  }, runTestSuite(f, g) {
    return Fb(a, b, f, d ? g : !1, e, h);
  }});
}
;class Mb {
  constructor(a, b, c = 2000, d = []) {
    this.timeout = c;
    this.name = a;
    this.fn = b;
    this.context = d;
    this.error = this.persistentContext = null;
  }
  get isFocused() {
    return this.name.startsWith("!");
  }
}
;function Nb(a) {
  ({u:a} = a);
  return a instanceof Z;
}
const Ob = a => a.some(b => b.startsWith("!")), Pb = a => a.reduce((b, c) => c instanceof Z ? [...b, c.name, ...c.G] : [...b, c.name], []);
function Qb(a, b) {
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
    this.H = a;
    this.I = c;
    this.s = e || (Nb(this) ? this.u.timeout : void 0);
    this.a = this.w = void 0;
    !Qb(this, d) && Nb(this) && (this.a = c.context);
    if ("object" != typeof b) {
      throw Error("You must provide tests in an object.");
    }
    this.A = !1;
    this.o = [];
    this.v = [];
    c = Object.assign({}, b);
    a = b.context;
    b = b.persistentContext;
    c = (delete c.context, delete c.persistentContext, c);
    void 0 !== a && Qb(this, a);
    void 0 !== b && (Array.isArray(b) ? this.w = b : "function" == (typeof b).toLowerCase() && (this.w = b));
    this.o = Rb(c, this);
    this.v = Pb(this.o);
    this.A = Ob(this.v);
  }
  get name() {
    return this.H;
  }
  get u() {
    return this.I;
  }
  get tests() {
    return this.o;
  }
  get context() {
    return this.a;
  }
  get timeout() {
    return this.s;
  }
  get hasFocused() {
    return this.A;
  }
  get G() {
    return this.v;
  }
  get isFocused() {
    return this.name.startsWith("!");
  }
  dump() {
    const a = this.name + u + this.tests.map(b => b.dump()).join("\n");
    return this.u ? M(a, "    ") : a;
  }
  get persistentContext() {
    return this.w;
  }
}
const Sb = (a, b) => {
  ({name:a} = a);
  ({name:b} = b);
  return "default" == a ? -1 : "default" == b ? 1 : 0;
};
function Tb(a) {
  const b = [], c = [];
  a.forEach(d => {
    d instanceof Mb ? c.push(d) : b.push(d);
  });
  a = b.sort(Sb);
  return [...c, ...a];
}
function Rb(a, b) {
  const c = Object.keys(a).map(d => {
    const e = a[d];
    if (e instanceof Z) {
      return e;
    }
    switch(typeof e) {
      case "function":
        return new Mb(d, e, b.timeout, b.context);
      case "object":
        return new Z(d, e, b);
    }
  }).filter(d => d);
  return Tb(c);
}
;function Ub() {
  Object.keys(require.cache).forEach(a => {
    ra("", a).startsWith("node_modules") || a == require.resolve("../") || delete require.cache[a];
  });
}
const Wb = async(a, b) => {
  a = await a.reduce(async(c, d) => {
    c = await c;
    const e = await Vb(d);
    return e ? Object.assign({}, c, {[d]:e}) : c;
  }, {});
  return new Z("Zoroaster Root Test Suite", a, null, void 0, b);
};
async function Xb(a) {
  return (await N(G, a)).reduce(async(b, c) => {
    b = await b;
    const d = D(a, c), e = await N(F, d);
    let h;
    if (e.isFile()) {
      var f = E(d);
      f = require(f);
      h = c.replace(/\.jsx?$/, "");
    } else {
      e.isDirectory() && (f = await Xb(d), h = c);
    }
    return b[h] ? (console.warn("Merging %s with %s in %s", h, c, a), b[h] = Yb(b[h], f), b) : Object.assign({}, b, {[h]:f});
  }, {});
}
const Yb = (a, b) => {
  Object.keys(b).forEach(c => {
    if (a[c]) {
      throw Error(`Duplicate key ${c}`);
    }
  });
  return Object.assign({}, a, b);
};
async function Vb(a) {
  try {
    const b = await N(F, a);
    if (b.isFile()) {
      const c = E(a);
      return require(c);
    }
    if (b.isDirectory()) {
      return await Xb(a);
    }
  } catch (b) {
    throw b.message += `\n${K("Could not require ", "red") + L(K(a, "white"), "red")}`, b;
  }
}
;function Zb(a, b) {
  a.forEach(c => {
    ya(c, (...d) => {
      b(c, ...d);
    });
  });
}
function $b(a) {
  a.forEach(b => {
    xa(b);
  });
}
async function ac({paths:a, watch:b, timeout:c, l:d, m:e, h}, {B:f = [], F:g} = {}) {
  $b(f);
  g && process.removeListener("beforeExit", g);
  f = await Wb(a, c);
  const k = Ta();
  g = Va();
  const m = Ua();
  k.pipe(m).pipe(process.stdout);
  k.pipe(g);
  ({i:g} = new J({rs:g}));
  var l = 0, n = 0;
  await Ib(r => {
    "object" == typeof r && (k.write(r), "test-end" == r.type && (l++, r.error && n++));
  }, [], f.tests, f.hasFocused, {l:d, m:e, h});
  k.end();
  f = await g;
  process.stdout.write(u);
  process.stdout.write(f);
  process.stdout.write(`\ud83e\udd85  Executed ${l} test${1 == l ? "" : "s"}`);
  n && process.stdout.write(`: ${n} error${1 < n ? "s" : ""}`);
  process.stdout.write(`.${u}`);
  const p = () => {
    process.exit(n);
  };
  process.once("beforeExit", p);
  if (b) {
    const r = Object.keys(require.cache).filter(q => !q.startsWith(`${process.cwd()}/node_modules/`));
    Zb(r, async(q, t) => {
      const v = a.filter(y => E(y) != q || t.mtime.getTime() ? !0 : (console.warn("Test suite file %s was deleted.", K(y, "yellow")), !1));
      Ub();
      await ac({paths:v, watch:b, timeout:c, l:d, m:e, h}, {B:r, F:p});
    });
  }
}
;function bc() {
  const {usage:a = {}, description:b, line:c, example:d} = {usage:cc, description:"A testing framework with support for test contexts and masks.\nAutomatically transpiles import/export and JSX with \u00c0LaMode.\nhttps://artdecocode.com/zoroaster/", line:"zoroaster path [pathN] [-w] [-ab] [-sr] [-vh]", example:"zoroaster test/spec test/mask -a"};
  var e = Object.keys(a);
  const h = Object.values(a), [f] = e.reduce(([m = 0, l = 0], n) => {
    const p = a[n].split("\n").reduce((r, q) => q.length > r ? q.length : r, 0);
    p > l && (l = p);
    n.length > m && (m = n.length);
    return [m, l];
  }, []), g = (m, l) => {
    l = " ".repeat(l - m.length);
    return `${m}${l}`;
  };
  e = e.reduce((m, l, n) => {
    n = h[n].split("\n");
    l = g(l, f);
    const [p, ...r] = n;
    l = `${l}\t${p}`;
    const q = g("", f);
    n = r.map(t => `${q}\t${t}`);
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
    var dc, cc = ea();
    dc = bc();
    console.log(dc);
    process.exit();
  }
}
if (ia) {
  try {
    require("@babel/register");
  } catch (a) {
    const b = E(process.cwd(), "node_modules/@babel/register");
    require(b);
  }
}
ha && require("alamode")();
(async() => {
  try {
    await ac({paths:[...fa || [], ...qa], watch:ja, timeout:ka, l:la, m:ma.split(","), h:na});
  } catch (a) {
    console.log(x(a.stack)), process.exit(1);
  }
})();

