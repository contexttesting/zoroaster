#!/usr/bin/env node
             
const path = require('path');
const os = require('os');
const fs = require('fs');
const stream = require('stream');
const util = require('util');
const assert = require('assert');
const readline = require('readline');             
const v = os.EOL, aa = os.homedir;
const x = /\s+at.*(?:\(|\s)(.*)\)?/, ba = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ca = aa(), y = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), f = new RegExp(ba.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(h => {
    h = h.match(x);
    if (null === h || !h[1]) {
      return !0;
    }
    h = h[1];
    return h.includes(".app/Contents/Resources/electron.asar") || h.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(h);
  }).filter(h => h.trim()).map(h => b ? h.replace(x, (e, g) => e.replace(g, g.replace(ca, "~"))) : h).join("\n");
};
const da = (a, b, c, d = !1, f = !1) => {
  const h = c ? new RegExp(`^-(${c}|-${b})$`) : new RegExp(`^--${b}$`);
  b = a.findIndex(e => h.test(e));
  if (-1 == b) {
    return {argv:a};
  }
  if (d) {
    return {value:!0, index:b, length:1};
  }
  d = a[b + 1];
  if (!d || "string" == typeof d && d.startsWith("--")) {
    return {argv:a};
  }
  f && (d = parseInt(d, 10));
  return {value:d, index:b, length:2};
}, ea = a => {
  const b = [];
  for (let c = 0; c < a.length; c++) {
    const d = a[c];
    if (d.startsWith("-")) {
      break;
    }
    b.push(d);
  }
  return b;
}, fa = () => {
  var a = z;
  return Object.keys(a).reduce((b, c) => {
    const d = a[c];
    if ("string" == typeof d) {
      return b[`-${d}`] = "", b;
    }
    c = d.command ? c : `--${c}`;
    d.short && (c = `${c}, -${d.short}`);
    let f = d.description;
    d.default && (f = `${f}\nDefault: ${d.default}.`);
    b[c] = f;
    return b;
  }, {});
};
const z = {tests:{description:"The location of the test suite directory or file.", command:!0, multiple:!0}, alamode:{description:"Enable import/export transpilation with \u00c0LaMode.", boolean:!0, short:"a"}, watch:{description:"Start the runner in _watch_ mode (rerun on changes).", boolean:!0, short:"w"}, timeout:{description:"Timeout for tests in ms.", number:!0, default:"2000", short:"t"}, snapshot:{description:"The location of the snapshot dir.", default:"test/snapshot", short:"s"}, snapshotRoot:{description:"The list of folders that will be roots in the snapshot dir.", 
default:"test/spec,test/mask", short:"r"}, interactive:{description:"Run in interactive mode, allowing to update snapshots\nand mask results when they don't match currently expected.", boolean:!0, short:"i"}, environment:{description:"\u00c0LaMode environment for applying settings via `.alamoderc.json`.\nEquivalent to setting `ALAMODE_ENV` env variable.", short:"e"}, babel:{description:"Require `@babel/register` (needs to be installed).", boolean:!0, short:"b"}, version:{description:"Show the current version.", 
boolean:!0, short:"v"}, help:{description:"Display help information.", boolean:!0, short:"h"}}, A = function(a = {}, b = process.argv) {
  let [, , ...c] = b;
  const d = ea(c);
  c = c.slice(d.length);
  a = Object.entries(a).reduce((e, [g, k]) => {
    e[g] = "string" == typeof k ? {short:k} : k;
    return e;
  }, {});
  const f = [];
  a = Object.entries(a).reduce((e, [g, k]) => {
    let l;
    try {
      const m = k.short, n = k.boolean, p = k.number, t = k.command, q = k.multiple;
      if (t && q && d.length) {
        l = d;
      } else {
        if (t && d.length) {
          l = d[0];
        } else {
          const r = da(c, g, m, n, p);
          ({value:l} = r);
          const u = r.index, w = r.length;
          void 0 !== u && w && f.push({index:u, length:w});
        }
      }
    } catch (m) {
      return e;
    }
    return void 0 === l ? e : {...e, [g]:l};
  }, {});
  let h = c;
  f.forEach(({index:e, length:g}) => {
    Array.from({length:g}).forEach((k, l) => {
      h[e + l] = null;
    });
  });
  h = h.filter(e => null !== e);
  Object.assign(a, {A:h});
  return a;
}(z), ha = A.tests, ia = A.alamode, ja = A.watch, ka = A.timeout || 2000, la = A.snapshot || "test/snapshot", ma = A.snapshotRoot || "test/spec,test/mask", na = A.interactive, B = A.environment, oa = A.babel, pa = A.version, qa = A.help, ra = A.A;
const C = path.dirname, D = path.join, E = path.relative, F = path.resolve;
const sa = fs.createReadStream, ta = fs.createWriteStream, G = fs.lstat, ua = fs.mkdir, va = fs.readdir, wa = fs.rmdir, xa = fs.unlink, ya = fs.unwatchFile, za = fs.watchFile;
var Aa = stream;
const H = stream.Transform, Ba = stream.Writable;
const Ca = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, Da = (a, b = !1) => Ca(a, 2 + (b ? 1 : 0)), Ea = a => {
  ({callee:{caller:a}} = a);
  return a;
};
function Fa(a, b, c = !1) {
  return function(d) {
    var f = Ea(arguments), {stack:h} = Error();
    const e = Ca(h, 2, !0), g = (h = d instanceof Error) ? d.message : d;
    f = [`Error: ${g}`, ...null !== f && a === f || c ? [b] : [e, b]].join("\n");
    f = y(f);
    return Object.assign(h ? d : Error(), {message:g, stack:f});
  };
}
;function I(a) {
  var {stack:b} = Error();
  const c = Ea(arguments);
  b = Da(b, a);
  return Fa(c, b, a);
}
;const Ga = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class J extends Ba {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {D:f = I(!0), proxyError:h} = a || {}, e = (g, k) => f(k);
    super(d);
    this.a = [];
    this.C = new Promise((g, k) => {
      this.on("finish", () => {
        let l;
        b ? l = Buffer.concat(this.a) : l = this.a.join("");
        g(l);
        this.a = [];
      });
      this.once("error", l => {
        if (-1 == l.stack.indexOf("\n")) {
          e`${l}`;
        } else {
          const m = y(l.stack);
          l.stack = m;
          h && e`${l}`;
        }
        k(l);
      });
      c && Ga(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.a.push(a);
    c();
  }
  get h() {
    return this.C;
  }
}
const Ha = async a => {
  ({h:a} = new J({rs:a, D:I(!0)}));
  return await a;
};
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function Ia(a, b, c) {
  let d = a[a.length - 1];
  d && d.c === b && d.i === c ? a[a.length - 1] = {count:d.count + 1, c:b, i:c} : a.push({count:1, c:b, i:c});
}
function Ja(a, b, c, d, f) {
  let h = c.length, e = d.length, g = b.b;
  f = g - f;
  let k = 0;
  for (; g + 1 < h && f + 1 < e && a.equals(c[g + 1], d[f + 1]);) {
    g++, f++, k++;
  }
  k && b.f.push({count:k});
  b.b = g;
  return f;
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
  let d = b.length, f = a.length, h = 1, e = d + f, g = [{b:-1, f:[]}];
  var k = Ja(c, g[0], b, a, 0);
  if (g[0].b + 1 >= d && k + 1 >= f) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; h <= e;) {
    a: {
      for (k = -1 * h; k <= h; k += 2) {
        var l = g[k - 1];
        let n = g[k + 1];
        var m = (n ? n.b : 0) - k;
        l && (g[k - 1] = void 0);
        let p = l && l.b + 1 < d;
        m = n && 0 <= m && m < f;
        if (p || m) {
          !p || m && l.b < n.b ? (l = {b:n.b, f:n.f.slice(0)}, Ia(l.f, void 0, !0)) : (l.b++, Ia(l.f, !0, void 0));
          m = Ja(c, l, b, a, k);
          if (l.b + 1 >= d && m + 1 >= f) {
            k = Na(c, l.f, b, a);
            break a;
          }
          g[k] = l;
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
  let f = 0, h = b.length, e = 0, g = 0;
  for (; f < h; f++) {
    var k = b[f];
    if (k.i) {
      k.value = a.join(d.slice(g, g + k.count)), g += k.count, f && b[f - 1].c && (k = b[f - 1], b[f - 1] = b[f], b[f] = k);
    } else {
      if (k.c) {
        k.value = a.join(c.slice(e, e + k.count));
      } else {
        let l = c.slice(e, e + k.count);
        l = l.map(function(m, n) {
          n = d[g + n];
          return n.length > m.length ? n : m;
        });
        k.value = a.join(l);
      }
      e += k.count;
      k.c || (g += k.count);
    }
  }
  c = b[h - 1];
  1 < h && "string" === typeof c.value && (c.c || c.i) && a.equals("", c.value) && (b[h - 2].value += c.value, b.pop());
  return b;
}
;const Oa = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, Pa = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function K(a, b) {
  return (b = Oa[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function L(a, b) {
  return (b = Pa[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function Qa(a, b) {
  return La(a, b).map(({c, i:d, value:f}) => {
    const h = f.split(" ");
    return c ? h.map(e => e.replace(/\n$/mg, "\u23ce\n")).map(e => K(e, "green")).join(L(" ", "green")) : d ? h.map(e => e.replace(/\n$/mg, "\u23ce\n")).map(e => K(e, "red")).join(L(" ", "red")) : K(f, "grey");
  }).join("");
}
;function M(a, b) {
  return a.replace(/^(?!\s*$)/mg, b);
}
function Ra({error:a, name:b}) {
  if (!a) {
    throw Error("cannot filter stack when a test does not have an error");
  }
  var c = a.stack.split("\n");
  const d = new RegExp(`at (.+\\.)?${b}`);
  b = c.findIndex(f => d.test(f)) + 1;
  c = c.slice(0, b).join("\n");
  return (c ? c : y(a.stack)).replace(/\n/g, v);
}
const Sa = " " + K("\u2713", "green") + " ", Ta = " " + K("\u2717", "red") + " ";
function Ua() {
  const a = [];
  return new H({objectMode:!0, transform({type:b, name:c, ...d}, f, h) {
    "test-suite-start" == b && "default" != c ? a.push(c) : "test-suite-end" == b && "default" != c && a.pop();
    f = a.slice();
    this.push({type:b, name:c, stack:f, ...d});
    h();
  }});
}
function Va() {
  return new H({objectMode:!0, transform({type:a, name:b, stack:c, result:d}, f, h) {
    "test-suite-start" == a && "default" != b ? (this.push(M(b, Array.from({length:2 * c.length}).join(" "))), this.push(v)) : "test-end" == a && (this.push(M(d, Array.from({length:2 * c.length}).join(" "))), this.push(v));
    h();
  }});
}
function Wa() {
  return new H({objectMode:!0, transform({error:a, stack:b, name:c}, d, f) {
    if (!a) {
      return f();
    }
    this.push("\u001b[31m");
    this.push(b.join(" > "));
    this.push(` > ${c}`);
    this.push("\u001b[0m");
    this.push(v);
    this.push(M(Ra({error:a, name:c}), "  "));
    this.push(v);
    this.push(v);
    f();
  }});
}
;async function N(a, b, c) {
  const d = I(!0);
  if ("function" != typeof a) {
    throw Error("Function must be passed.");
  }
  if (!a.length) {
    throw Error(`Function${a.name ? ` ${a.name}` : ""} does not accept any arguments.`);
  }
  return await new Promise((f, h) => {
    const e = (k, l) => k ? (k = d(k), h(k)) : f(c || l);
    let g = [e];
    Array.isArray(b) ? g = [...b, e] : 1 < Array.from(arguments).length && (g = [b, e]);
    a(...g);
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
  const d = new Promise((f, h) => {
    c = Xa(a, b, h);
  });
  return {timeout:c, h:d};
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
  const {h:d, timeout:f} = Ya(c, b);
  try {
    return await Promise.race([a, d]);
  } finally {
    clearTimeout(f);
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
  const {context:b, timeout:c = null, fn:d, persistentContext:f, onCatchment:h} = a;
  a = new Date;
  let e = null, g = null, k = null, l = [], m, n;
  try {
    b && (m = b ? Za(b) : Promise.resolve([]), m.then(() => {
      n = !0;
    }), l = await (c ? O(m, c, "Evaluate context") : m));
    const p = f ? [...Array.isArray(f) ? f : [f], ...l] : l, t = d(...p);
    t instanceof Promise ? g = await (c ? O(t, c, "Test") : t) : g = t;
  } catch (p) {
    e = p;
  }
  if (g instanceof Aa) {
    try {
      const p = new J({rs:g});
      h && h(p);
      g = await p.h;
    } catch (p) {
      e = p;
    }
  }
  try {
    const p = P(l);
    k = await (c ? O(p, c, "Destroy") : p);
  } catch (p) {
    e = p;
  }
  !n && m && ab(m);
  return {started:a, finished:new Date, error:e, result:g, destroyResult:k};
}, ab = async a => {
  a = await a;
  await P(a);
};
const cb = async(a, b) => {
  const {onlyFocused:c = !1, runTest:d, runTestSuite:f} = b, h = !c;
  return await a.reduce(async(e, g) => {
    const k = g.name, l = g.isFocused;
    var m = g.hasFocused;
    const n = !!g.fn;
    if (h || l || m) {
      e = e instanceof Promise ? await e : e, n ? (m = await d(g), Object.assign(g, m), e[k] = g) : (g = await f(g, m), e[k] = g);
    }
    return e;
  }, {});
};
const db = assert.deepStrictEqual, eb = assert.equal;
const fb = readline.createInterface;
function gb(a, b = {}) {
  const {timeout:c, password:d = !1, output:f = process.stdout, input:h = process.stdin, ...e} = b;
  b = fb({input:h, output:f, ...e});
  if (d) {
    const k = b.output;
    b._writeToOutput = l => {
      if (["\r\n", "\n", "\r"].includes(l)) {
        return k.write(l);
      }
      l = l.split(a);
      "2" == l.length ? (k.write(a), k.write("*".repeat(l[1].length))) : k.write("*");
    };
  }
  var g = new Promise(b.question.bind(b, a));
  g = c ? O(g, c, `reloquent: ${a}`) : g;
  b.promise = hb(g, b);
  return b;
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
    var f = a[d];
    switch(typeof f) {
      case "object":
        f = {...f};
        break;
      case "string":
        f = {text:f};
        break;
      default:
        throw Error("A question must be a string or an object.");
    }
    f.text = `${f.text}${f.text.endsWith("?") ? "" : ":"} `;
    var h;
    if (f.defaultValue) {
      var e = f.defaultValue;
    }
    f.getDefault && (h = await f.getDefault());
    let g = e || "";
    e && h && e != h ? g = `\x1b[90m${e}\x1b[0m` : e && e == h && (g = "");
    e = h || "";
    ({promise:e} = gb(`${f.text}${g ? `[${g}] ` : ""}${e ? `[${e}] ` : ""}`, {timeout:b, password:f.password}));
    h = await e || h || f.defaultValue;
    "function" == typeof f.validation && f.validation(h);
    "function" == typeof f.postProcess && (h = await f.postProcess(h));
    return {...c, [d]:h};
  }, {});
}
;async function Q(a) {
  const {defaultYes:b = !0, timeout:c} = {}, d = a.endsWith("?");
  ({question:a} = await ib({question:{text:`${d ? a.replace(/\?$/, "") : a} (y/n)${d ? "?" : ""}`, defaultValue:b ? "y" : "n"}}, c));
  return "y" == a;
}
;const jb = util.inspect;
const R = (...a) => {
  let b = -1;
  return "%s%s".replace(/%s/g, () => {
    b++;
    return a[b];
  });
};
function kb(a, b) {
  let c = 0;
  const d = (e, g) => {
    const k = " ".repeat(2 * c);
    g = void 0 !== g ? K("+ " + S(g), "green") : null;
    e = void 0 !== e ? K("- " + S(e), "red") : null;
    const l = [];
    e && l.push(R(k, e));
    g && l.push(R(k, g));
    return l.join("\n");
  }, f = e => {
    const g = " ".repeat(2 * c);
    return R(g, e);
  }, h = (e, g) => {
    if (e instanceof Date && g instanceof Date) {
      var k = e.getTime() != g.getTime() ? !1 : void 0;
      return k ? "" : d(e, g);
    }
    if (e instanceof Date && !(g instanceof Date) || !(e instanceof Date) && g instanceof Date || Array.isArray(e) && !Array.isArray(g) || !Array.isArray(e) && Array.isArray(g)) {
      return d(e, g);
    }
    if (T(e) && T(g) || !T(e) && T(g) || T(e) && !T(g)) {
      return e != g ? d(e, g) : "";
    }
    if (e.constructor && !g.constructor) {
      return d(e.constructor.name, g);
    }
    if (!e.constructor && g.constructor) {
      return d(e, g.constructor.name);
    }
    if (e.constructor && g.constructor) {
      if (e.constructor.name != g.constructor.name) {
        return d(e.constructor.name, g.constructor.name);
      }
      k = e.valueOf();
      var l = g.valueOf();
      if (T(k) && T(l) && k != l) {
        return d(k, l);
      }
    }
    if (Array.isArray(e) && Array.isArray(g)) {
      let m;
      k = e.map((n, p) => {
        m = p;
        (n = h(n, g[p])) && (n = `${f(`[${p}]`)}\n${n}`);
        return n;
      }).filter(Boolean);
      l = g.slice(m + 1).map((n, p) => `${f(`[${m + p + 1}]`)}\n${d(void 0, n)}`);
      return [...k, ...l].join("\n");
    }
    if ("object" == typeof e && "object" == typeof g) {
      const m = [], n = [], p = [];
      Object.keys(e).forEach(q => {
        q in g ? p.push(q) : n.push(q);
      });
      Object.keys(g).forEach(q => {
        q in e || m.push(q);
      });
      k = n.map(q => {
        let r = S(e[q]);
        return d(`${q}${`: ${r}`}`);
      });
      l = m.map(q => d(void 0, `${q}: ${S(g[q])}`));
      const t = p.map(q => {
        c++;
        const r = h(e[q], g[q]);
        let u = "";
        r && (u += f(Array.isArray(e[q]) && Array.isArray(g[q]) ? `${q}.Array` : q), u += "\n" + r);
        c--;
        return u;
      }).filter(Boolean);
      return [...k, ...l, ...t].join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", e, g);
  };
  return h(a, b);
}
const T = a => null === a ? !0 : "string number boolean symbol null undefined".split(" ").includes(typeof a), S = a => Array.isArray(a) ? `Array[${a.toString()}]` : a && a.toString ? a.toString() : `${a}`;
async function lb(a) {
  a = sa(a);
  return await Ha(a);
}
;async function mb(a, b) {
  if (!a) {
    throw Error("No path is given.");
  }
  const c = I(!0), d = ta(a);
  await new Promise((f, h) => {
    d.on("error", e => {
      e = c(e);
      h(e);
    }).on("close", f).end(b);
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
  a = a.split("\n");
  const b = {}.width || a.reduce((c, {length:d}) => d > c ? d : c, 0);
  return a.map(ob.bind(null, b)).join("\n");
};
function qb(a) {
  const {padding:b = 1} = {};
  var c = a.split("\n").reduce((h, {length:e}) => e > h ? e : h, 0) + 2 * b;
  const d = `\u250c${"\u2500".repeat(c)}\u2510`;
  c = `\u2514${"\u2500".repeat(c)}\u2518`;
  const f = " ".repeat(b);
  a = pb(a).split("\n").map(h => `\u2502${f}${h}${f}\u2502`).join("\n");
  return `${d}\n${a}\n${c}`;
}
;async function V(a, b, c) {
  a = F(a.a, b);
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
async function sb(a, b, c, d, f = !1) {
  if (!c) {
    throw Error("Pass the actual value for snapshot.");
  }
  const h = I(!0), e = /\.json$/.test(b);
  let g;
  try {
    if (g = await a.read(b), e) {
      var k = g;
      try {
        db(c, k, void 0);
      } catch (m) {
        const n = kb(k, c);
        m.message = [m.message, n].filter(Boolean).join("\n");
        throw m;
      }
    } else {
      eb(c, g);
    }
  } catch (m) {
    if ("ENOENT" == m.code) {
      await rb(a, b, c, d);
    } else {
      var l;
      e || (l = Qa(g, c));
      if (f && (e ? console.log(m.message) : console.log(l), await Q(`Update snapshot${d ? ` for ${d}` : ""}?`))) {
        await V(a, b, c);
        return;
      }
      if (!e) {
        throw !f && console.log(l), a = h("The string didn't match the snapshot."), a.J = l, a;
      }
      throw h(m);
    }
  }
}
class tb {
  constructor() {
    this.a = "test/snapshot";
  }
  async prompt(a, b) {
    if ("string" == typeof a) {
      let c = a.split("\n").reduce((d, f) => {
        if (f.length > d) {
          return f.length;
        }
      }, 0);
      process.stdout.isTTY && process.stdout.columns - 4 >= c ? console.log(qb(a)) : console.log(a);
    } else {
      console.log(jb(a, {colors:!0}));
    }
    return await Q(`Save snapshot${b ? ` for ${b}` : ""}?`);
  }
  async read(a) {
    a = F(this.a, a);
    return /\.json$/.test(a) ? (a = await lb(a), JSON.parse(a)) : await lb(a);
  }
}
;const W = async a => {
  try {
    return await N(G, a);
  } catch (b) {
    return null;
  }
};
async function ub(a, b) {
  b = b.map(async c => {
    const d = D(a, c);
    return {lstat:await N(G, d), path:d, relativePath:c};
  });
  return await Promise.all(b);
}
const vb = a => a.lstat.isDirectory(), wb = a => !a.lstat.isDirectory();
async function xb(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  const {ignore:b = []} = {};
  if (!(await N(G, a)).isDirectory()) {
    var c = Error("Path is not a directory");
    c.code = "ENOTDIR";
    throw c;
  }
  c = await N(va, a);
  var d = await ub(a, c);
  c = d.filter(vb);
  d = d.filter(wb).reduce((f, h) => {
    var e = h.lstat.isDirectory() ? "Directory" : h.lstat.isFile() ? "File" : h.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return {...f, [h.relativePath]:{type:e}};
  }, {});
  c = await c.reduce(async(f, {path:h, relativePath:e}) => {
    const g = E(a, h);
    if (b.includes(g)) {
      return f;
    }
    f = await f;
    h = await xb(h);
    return {...f, [e]:h};
  }, {});
  return {content:{...d, ...c}, type:"Directory"};
}
;const yb = async a => {
  await N(xa, a);
}, zb = async a => {
  const {content:b} = await xb(a);
  var c = Object.keys(b).filter(f => {
    ({type:f} = b[f]);
    if ("File" == f || "SymbolicLink" == f) {
      return !0;
    }
  }), d = Object.keys(b).filter(f => {
    ({type:f} = b[f]);
    if ("Directory" == f) {
      return !0;
    }
  });
  c = c.map(f => D(a, f));
  await Promise.all(c.map(yb));
  d = d.map(f => D(a, f));
  await Promise.all(d.map(zb));
  await N(wa, a);
}, Ab = async a => {
  (await N(G, a)).isDirectory() ? await zb(a) : await yb(a);
};
const Bb = a => a.replace(/^!/, ""), Cb = async(a, b, c, d = "", f = [], h = !1, e = "txt") => {
  var g = b.replace(/^!/, "");
  const k = g.replace(/ /g, "-");
  b = "string" == typeof a;
  const l = `${k}.${b ? e : "json"}`;
  let m = D(...c.map(Bb));
  (c = f.find(n => {
    n = D(...n.split("/"));
    return m.startsWith(n);
  })) && (m = m.slice(c.length));
  f = D(d, m);
  d = D(f, l);
  if (a) {
    if (c = new tb, c.a = f, e = D(f, `${k}.${b ? "json" : e}`), await W(e)) {
      g = `Snapshot of another type exists: ${K(e, "red")}`, h || X(g), console.log("%s.\nNew data:", g), console.log(b ? a : jb(a, {colors:!0})), await Q(`Update snapshot ${K(e, "yellow")} to a new type?`) || X(g), await V(c, l, a), await Ab(e);
    } else {
      try {
        await sb(c, l, a, K(g, "yellow"), h);
      } catch (n) {
        "The string didn't match the snapshot." == n.message && (n.message = `The string didn't match the snapshot ${K(d, "yellow")}`), X(n);
      }
    }
  } else {
    a = await W(d), a || (d = d.replace(/json$/, e), a = await W(d)), a && X(`Snapshot ${d} exists, but the test did not return anything.`);
  }
}, X = a => {
  a = Error(a);
  a.stack = a.message;
  throw a;
};
const Y = require("../");
async function Db(a, b, {name:c, context:d, fn:f, timeout:h, persistentContext:e}, g = {}, k = null) {
  a && a({name:c, type:"test-start"});
  let l, m, n;
  d = Array.isArray(d) ? d : [d];
  d.forEach(r => {
    r.prototype instanceof Y && (l = r.snapshotExtension, n = r.serialise);
  });
  d = (f.name ? d.slice(0, f.length) : d).map(r => {
    try {
      return r === Y || r.prototype instanceof Y ? {["snapshotExtension"](u) {
        l = u;
      }, ["snapshotSource"](u, w) {
        m = u;
        w && (l = w);
      }} : r;
    } catch (u) {
      return r;
    }
  });
  let p, t;
  const q = r => {
    if (p) {
      return p.emit("error", r);
    }
    k = r;
  };
  if (!k) {
    process.once("uncaughtException", q);
    process.once("unhandledRejection", q);
    try {
      t = await bb({context:d, persistentContext:e, fn:f, timeout:h, onCatchment(w) {
        p = w;
      }});
      let {result:r, error:u} = t;
      k || (k = u);
      if (!k) {
        try {
          void 0 !== r && n && (r = n(r)), await Cb(r, m || c, b, g.j, g.l, g.g, l);
        } catch (w) {
          k = w;
        }
      }
      if (g.g && u && u.handleUpdate) {
        try {
          await u.handleUpdate() && (k = null);
        } catch (w) {
          k = w;
        }
      }
    } finally {
      process.removeListener("uncaughtException", q), process.removeListener("unhandledRejection", q);
    }
  }
  a && a({name:c, error:k, type:"test-end", result:Eb({error:k, name:c})});
  return t;
}
function Eb({error:a, name:b}) {
  return null === a ? `${Sa} ${b}` : `${Ta} ${b}` + v + M(Ra({error:a, name:b}), " | ");
}
async function Fb(a, b, {name:c, tests:d, persistentContext:f}, h, e, g) {
  a && a({type:"test-suite-start", name:c});
  let k, l;
  if (f && !g) {
    try {
      k = await Gb(f), Hb(d, k);
    } catch (m) {
      m.message = `Persistent context failed to evaluate: ${m.message}`, m.stack = m.stack.split("\n", 2).join("\n"), g = m;
    }
  }
  try {
    const m = [...b, c.replace(/\.jsx?$/, "")];
    l = await Ib(a, m, d, h, e, g);
    a && a({type:"test-suite-end", name:c});
  } finally {
    if (k) {
      try {
        await Jb(k);
      } catch (m) {
        m.stack = m.stack.split("\n", 2).join("\n"), console.log(K(m.stack, "red"));
      }
    }
  }
  return l;
}
const Hb = (a, b) => {
  a.forEach(c => {
    c.persistentContext = b;
  });
}, Kb = async a => {
  const b = $a(a);
  return await O(b, a.o || 5000, `Evaluate persistent context ${a.name ? a.name : ""}`);
}, Gb = async a => {
  a = Array.isArray(a) ? a : [a];
  return await Promise.all(a.map(b => Kb(b)));
}, Lb = async a => {
  const b = P([a]);
  return await O(b, a.o || 5000, `Destroy persistent context ${a.name ? a.name : ""}`);
}, Jb = async a => await Promise.all(a.map(b => Lb(b)));
async function Ib(a, b, c, d, f, h) {
  return await cb(c, {onlyFocused:d, runTest(e) {
    return Db(a, b, e, f, h);
  }, runTestSuite(e, g) {
    return Fb(a, b, e, d ? g : !1, f, h);
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
;function Nb({s:a}) {
  return a instanceof Z;
}
const Ob = a => a.some(b => b.startsWith("!") || b.startsWith("$")), Pb = a => a.reduce((b, c) => c instanceof Z ? [...b, c.name, ...c.G] : [...b, c.name], []);
function Qb(a, b) {
  if (Array.isArray(b) || "function" == (typeof b).toLowerCase()) {
    return a.a = b, !0;
  }
  if ("object" == (typeof b).toLowerCase()) {
    return a.a = Object.freeze({...a.a || {}, ...b}), !0;
  }
}
class Z {
  constructor(a, b, c, d, f) {
    if (!a) {
      throw Error("Test suite name must be given.");
    }
    this.H = a;
    this.I = c;
    this.o = f || (Nb(this) ? this.s.timeout : void 0);
    this.a = this.v = void 0;
    !Qb(this, d) && Nb(this) && (this.a = c.context);
    if ("object" != typeof b) {
      throw Error("You must provide tests in an object.");
    }
    this.w = !1;
    this.m = [];
    this.u = [];
    {
      const {context:h, persistentContext:e, ...g} = b;
      void 0 !== h && Qb(this, h);
      void 0 !== e && (a = e, Array.isArray(a) ? this.v = a : "function" == (typeof a).toLowerCase() && (this.v = a));
      this.m = Rb(g, this);
      this.u = Pb(this.m);
      this.w = Ob(this.u);
    }
  }
  get name() {
    return this.H;
  }
  get s() {
    return this.I;
  }
  get tests() {
    return this.m;
  }
  get context() {
    return this.a;
  }
  get timeout() {
    return this.o;
  }
  get hasFocused() {
    return this.w;
  }
  get G() {
    return this.u;
  }
  get isFocused() {
    return this.name.startsWith("!") || this.name.startsWith("$");
  }
  dump() {
    const a = this.name + v + this.tests.map(b => b.dump()).join("\n");
    return this.s ? M(a, "    ") : a;
  }
  get persistentContext() {
    return this.v;
  }
}
const Sb = ({name:a}, {name:b}) => "default" == a ? -1 : "default" == b ? 1 : 0;
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
    const f = a[d];
    if (f instanceof Z) {
      return f;
    }
    switch(typeof f) {
      case "function":
        return new Mb(d, f, b.timeout, b.context);
      case "object":
        return new Z(d, f, b);
    }
  }).filter(d => d);
  return Tb(c);
}
;function Ub() {
  Object.keys(require.cache).forEach(a => {
    E("", a).startsWith("node_modules") || a == require.resolve("../") || delete require.cache[a];
  });
}
const Wb = async(a, b) => {
  a = await a.reduce(async(c, d) => {
    c = await c;
    const f = await Vb(d);
    return f ? {...c, [d]:f} : c;
  }, {});
  return new Z("Zoroaster Root Test Suite", a, null, void 0, b);
};
async function Xb(a) {
  return (await N(va, a)).reduce(async(b, c) => {
    b = await b;
    const d = D(a, c), f = await N(G, d);
    let h;
    if (f.isFile()) {
      var e = F(d);
      e = require(e);
      h = c.replace(/\.jsx?$/, "");
    } else {
      f.isDirectory() && (e = await Xb(d), h = c);
    }
    return b[h] ? (console.warn("Merging %s with %s in %s", h, c, a), b[h] = Yb(b[h], e), b) : {...b, [h]:e};
  }, {});
}
const Yb = (a, b) => {
  Object.keys(b).forEach(c => {
    if (a[c]) {
      throw Error(`Duplicate key ${c}`);
    }
  });
  return {...a, ...b};
};
async function Vb(a) {
  try {
    const b = await N(G, a);
    if (b.isFile()) {
      const c = F(a);
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
    za(c, (...d) => {
      b(c, ...d);
    });
  });
}
function $b(a) {
  a.forEach(b => {
    ya(b);
  });
}
async function ac({paths:a, watch:b, timeout:c, j:d, l:f, g:h}, {B:e = [], F:g} = {}) {
  $b(e);
  g && process.removeListener("beforeExit", g);
  e = await Wb(a, c);
  const k = Ua();
  g = Wa();
  const l = Va();
  k.pipe(l).pipe(process.stdout);
  k.pipe(g);
  ({h:g} = new J({rs:g}));
  var m = 0, n = 0;
  await Ib(t => {
    "object" == typeof t && (k.write(t), "test-end" == t.type && (m++, t.error && n++));
  }, [], e.tests, e.hasFocused, {j:d, l:f, g:h});
  k.end();
  e = await g;
  process.stdout.write(v);
  process.stdout.write(e);
  process.stdout.write(`\ud83e\udd85  Executed ${m} test${1 == m ? "" : "s"}`);
  n && process.stdout.write(`: ${n} error${1 < n ? "s" : ""}`);
  process.stdout.write(`.${v}`);
  const p = () => {
    process.exit(n);
  };
  process.once("beforeExit", p);
  if (b) {
    const t = Object.keys(require.cache).filter(q => !q.startsWith(`${process.cwd()}/node_modules/`));
    Zb(t, async(q, r) => {
      const u = a.filter(w => F(w) != q || r.mtime.getTime() ? !0 : (console.warn("Test suite file %s was deleted.", K(w, "yellow")), !1));
      Ub();
      await ac({paths:u, watch:b, timeout:c, j:d, l:f, g:h}, {B:t, F:p});
    });
  }
}
;function bc(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:f} = a;
  a = Object.keys(b);
  const h = Object.values(b), [e] = a.reduce(([l = 0, m = 0], n) => {
    const p = b[n].split("\n").reduce((t, q) => q.length > t ? q.length : t, 0);
    p > m && (m = p);
    n.length > l && (l = n.length);
    return [l, m];
  }, []), g = (l, m) => {
    m = " ".repeat(m - l.length);
    return `${l}${m}`;
  };
  a = a.reduce((l, m, n) => {
    n = h[n].split("\n");
    m = g(m, e);
    const [p, ...t] = n;
    m = `${m}\t${p}`;
    const q = g("", e);
    n = t.map(r => `${q}\t${r}`);
    return [...l, m, ...n];
  }, []).map(l => `\t${l}`);
  const k = [c, `  ${d || ""}`].filter(l => l ? l.trim() : l).join("\n\n");
  a = `${k ? `${k}\n` : ""}
${a.join("\n")}
`;
  return f ? `${a}
  Example:

    ${f}
` : a;
}
;if (pa) {
  console.log(require("../../package.json").version), process.exit();
} else {
  if (qa) {
    var cc;
    {
      const a = fa();
      cc = bc({usage:a, description:"A context-testing framework with support for mask and fork-testing.\nAutomatically transpiles import/export and JSX with \u00c0LaMode.\nhttps://www.contexttesting.com", line:"zoroaster path [pathN] [-w] [-a [-e env]] [-sr] [-vh]", example:"zoroaster test/spec test/mask -a"});
    }
    console.log(cc);
    process.exit();
  }
}
if (oa) {
  try {
    require("@babel/register");
  } catch (a) {
    const b = F(process.cwd(), "node_modules/@babel/register");
    require(b);
  }
}
ia && (B && (process.env.ALAMODE_ENV = B), require("alamode")());
(async() => {
  try {
    await ac({paths:[...ha || [], ...ra], watch:ja, timeout:ka, j:la, l:ma.split(","), g:na});
  } catch (a) {
    console.log(y(a.stack)), process.exit(1);
  }
})();

