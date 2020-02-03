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
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(ba.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(h => {
    h = h.match(x);
    if (null === h || !h[1]) {
      return !0;
    }
    h = h[1];
    return h.includes(".app/Contents/Resources/electron.asar") || h.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(h);
  }).filter(h => h.trim()).map(h => b ? h.replace(x, (f, g) => f.replace(g, g.replace(ca, "~"))) : h).join("\n");
};
const da = (a, b, c, d = !1, e = !1) => {
  const h = c ? new RegExp(`^-(${c}|-${b})$`) : new RegExp(`^--${b}$`);
  b = a.findIndex(f => h.test(f));
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
  e && (d = parseInt(d, 10));
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
    let e = d.description;
    d.default && (e = `${e}\nDefault: ${d.default}.`);
    b[c] = e;
    return b;
  }, {});
};
const z = {tests:{description:"The location of the test suite directory or file.", command:!0, multiple:!0}, alamode:{description:"Enable import/export transpilation with \u00c0LaMode.", boolean:!0, short:"a"}, babel:{description:"Require `@babel/register` (needs to be installed).", boolean:!0, short:"b"}, watch:{description:"Start the runner in _watch_ mode (rerun on changes).", boolean:!0, short:"w"}, timeout:{description:"Timeout for tests in ms.", number:!0, default:"2000", short:"t"}, snapshot:{description:"The location of the snapshot dir.", 
default:"test/snapshot", short:"s"}, snapshotRoot:{description:"The list of folders that will be roots in the snapshot dir.", default:"test/spec,test/mask", short:"r"}, interactive:{description:"Run in interactive mode, allowing to update snapshots\nand mask results when they don't match currently expected.", boolean:!0, short:"i"}, version:{description:"Show the current version.", boolean:!0, short:"v"}, help:{description:"Display help information.", boolean:!0, short:"h"}}, A = function(a = {}, 
b = process.argv) {
  let [, , ...c] = b;
  const d = ea(c);
  c = c.slice(d.length);
  a = Object.entries(a).reduce((f, [g, k]) => {
    f[g] = "string" == typeof k ? {short:k} : k;
    return f;
  }, {});
  const e = [];
  a = Object.entries(a).reduce((f, [g, k]) => {
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
          void 0 !== u && w && e.push({index:u, length:w});
        }
      }
    } catch (m) {
      return f;
    }
    return void 0 === l ? f : {...f, [g]:l};
  }, {});
  let h = c;
  e.forEach(({index:f, length:g}) => {
    Array.from({length:g}).forEach((k, l) => {
      h[f + l] = null;
    });
  });
  h = h.filter(f => null !== f);
  Object.assign(a, {A:h});
  return a;
}(z), ha = A.tests, ia = A.alamode, ja = A.babel, ka = A.watch, la = A.timeout || 2000, ma = A.snapshot || "test/snapshot", na = A.snapshotRoot || "test/spec,test/mask", oa = A.interactive, pa = A.version, qa = A.help, ra = A.A;
const B = path.dirname, C = path.join, D = path.relative, E = path.resolve;
const sa = fs.createReadStream, ta = fs.createWriteStream, F = fs.lstat, ua = fs.mkdir, G = fs.readdir, va = fs.rmdir, wa = fs.unlink, xa = fs.unwatchFile, ya = fs.watchFile;
var za = stream;
const H = stream.Transform, Aa = stream.Writable;
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
    e = y(e);
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
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {D:e = I(!0), proxyError:h} = a || {}, f = (g, k) => e(k);
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
          f`${l}`;
        } else {
          const m = y(l.stack);
          l.stack = m;
          h && f`${l}`;
        }
        k(l);
      });
      c && Fa(this, c).pipe(this);
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
const Ga = async a => {
  ({h:a} = new J({rs:a, D:I(!0)}));
  return await a;
};
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function Ha(a, b, c) {
  let d = a[a.length - 1];
  d && d.c === b && d.i === c ? a[a.length - 1] = {count:d.count + 1, c:b, i:c} : a.push({count:1, c:b, i:c});
}
function Ia(a, b, c, d, e) {
  let h = c.length, f = d.length, g = b.b;
  e = g - e;
  let k = 0;
  for (; g + 1 < h && e + 1 < f && a.equals(c[g + 1], d[e + 1]);) {
    g++, e++, k++;
  }
  k && b.f.push({count:k});
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
  let d = b.length, e = a.length, h = 1, f = d + e, g = [{b:-1, f:[]}];
  var k = Ia(c, g[0], b, a, 0);
  if (g[0].b + 1 >= d && k + 1 >= e) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; h <= f;) {
    a: {
      for (k = -1 * h; k <= h; k += 2) {
        var l = g[k - 1];
        let n = g[k + 1];
        var m = (n ? n.b : 0) - k;
        l && (g[k - 1] = void 0);
        let p = l && l.b + 1 < d;
        m = n && 0 <= m && m < e;
        if (p || m) {
          !p || m && l.b < n.b ? (l = {b:n.b, f:n.f.slice(0)}, Ha(l.f, void 0, !0)) : (l.b++, Ha(l.f, !0, void 0));
          m = Ia(c, l, b, a, k);
          if (l.b + 1 >= d && m + 1 >= e) {
            k = Ma(c, l.f, b, a);
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
    if (k.i) {
      k.value = a.join(d.slice(g, g + k.count)), g += k.count, e && b[e - 1].c && (k = b[e - 1], b[e - 1] = b[e], b[e] = k);
    } else {
      if (k.c) {
        k.value = a.join(c.slice(f, f + k.count));
      } else {
        let l = c.slice(f, f + k.count);
        l = l.map(function(m, n) {
          n = d[g + n];
          return n.length > m.length ? n : m;
        });
        k.value = a.join(l);
      }
      f += k.count;
      k.c || (g += k.count);
    }
  }
  c = b[h - 1];
  1 < h && "string" === typeof c.value && (c.c || c.i) && a.equals("", c.value) && (b[h - 2].value += c.value, b.pop());
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
  return Ka(a, b).map(({c, i:d, value:e}) => {
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
  return (c ? c : y(a.stack)).replace(/\n/g, v);
}
const Ra = " " + K("\u2713", "green") + " ", Sa = " " + K("\u2717", "red") + " ";
function Ta() {
  const a = [];
  return new H({objectMode:!0, transform({type:b, name:c, ...d}, e, h) {
    "test-suite-start" == b && "default" != c ? a.push(c) : "test-suite-end" == b && "default" != c && a.pop();
    e = a.slice();
    this.push({type:b, name:c, stack:e, ...d});
    h();
  }});
}
function Ua() {
  return new H({objectMode:!0, transform({type:a, name:b, stack:c, result:d}, e, h) {
    "test-suite-start" == a && "default" != b ? (this.push(M(b, Array.from({length:2 * c.length}).join(" "))), this.push(v)) : "test-end" == a && (this.push(M(d, Array.from({length:2 * c.length}).join(" "))), this.push(v));
    h();
  }});
}
function Va() {
  return new H({objectMode:!0, transform({error:a, stack:b, name:c}, d, e) {
    if (!a) {
      return e();
    }
    this.push("\u001b[31m");
    this.push(b.join(" > "));
    this.push(` > ${c}`);
    this.push("\u001b[0m");
    this.push(v);
    this.push(M(Qa({error:a, name:c}), "  "));
    this.push(v);
    this.push(v);
    e();
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
  return await new Promise((e, h) => {
    const f = (k, l) => k ? (k = d(k), h(k)) : e(c || l);
    let g = [f];
    Array.isArray(b) ? g = [...b, f] : 1 < Array.from(arguments).length && (g = [b, f]);
    a(...g);
  });
}
;function Wa(a, b, c) {
  return setTimeout(() => {
    const d = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    d.stack = `Error: ${d.message}`;
    c(d);
  }, b);
}
function Xa(a, b) {
  let c;
  const d = new Promise((e, h) => {
    c = Wa(a, b, h);
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
  const {h:d, timeout:e} = Xa(c, b);
  try {
    return await Promise.race([a, d]);
  } finally {
    clearTimeout(e);
  }
}
;async function Ya(a = []) {
  a = (Array.isArray(a) ? a : [a]).map(Za);
  return await Promise.all(a);
}
const Za = async a => {
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
const ab = async a => {
  const {context:b, timeout:c = null, fn:d, persistentContext:e, onCatchment:h} = a;
  a = new Date;
  let f = null, g = null, k = null, l = [], m, n;
  try {
    b && (m = b ? Ya(b) : Promise.resolve([]), m.then(() => {
      n = !0;
    }), l = await (c ? O(m, c, "Evaluate context") : m));
    const p = e ? [...Array.isArray(e) ? e : [e], ...l] : l, t = d(...p);
    t instanceof Promise ? g = await (c ? O(t, c, "Test") : t) : g = t;
  } catch (p) {
    f = p;
  }
  if (g instanceof za) {
    try {
      const p = new J({rs:g});
      h && h(p);
      g = await p.h;
    } catch (p) {
      f = p;
    }
  }
  try {
    const p = P(l);
    k = await (c ? O(p, c, "Destroy") : p);
  } catch (p) {
    f = p;
  }
  !n && m && $a(m);
  return {started:a, finished:new Date, error:f, result:g, destroyResult:k};
}, $a = async a => {
  a = await a;
  await P(a);
};
const bb = async(a, b) => {
  const {onlyFocused:c = !1, runTest:d, runTestSuite:e} = b, h = !c;
  return await a.reduce(async(f, g) => {
    const k = g.name, l = g.isFocused;
    var m = g.hasFocused;
    const n = !!g.fn;
    if (h || l || m) {
      f = f instanceof Promise ? await f : f, n ? (m = await d(g), Object.assign(g, m), f[k] = g) : (g = await e(g, m), f[k] = g);
    }
    return f;
  }, {});
};
const cb = assert.deepStrictEqual, db = assert.equal;
const eb = readline.createInterface;
function fb(a, b = {}) {
  const {timeout:c, password:d = !1, output:e = process.stdout, input:h = process.stdin, ...f} = b;
  b = eb({input:h, output:e, ...f});
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
  b.promise = gb(g, b);
  return b;
}
const gb = async(a, b) => {
  try {
    return await a;
  } finally {
    b.close();
  }
};
async function hb(a, b) {
  if ("object" != typeof a) {
    throw Error("Please give an object with questions");
  }
  return await Object.keys(a).reduce(async(c, d) => {
    c = await c;
    var e = a[d];
    switch(typeof e) {
      case "object":
        e = {...e};
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
    ({promise:f} = fb(`${e.text}${g ? `[${g}] ` : ""}${f ? `[${f}] ` : ""}`, {timeout:b, password:e.password}));
    h = await f || h || e.defaultValue;
    "function" == typeof e.validation && e.validation(h);
    "function" == typeof e.postProcess && (h = await e.postProcess(h));
    return {...c, [d]:h};
  }, {});
}
;async function Q(a) {
  const {defaultYes:b = !0, timeout:c} = {}, d = a.endsWith("?");
  ({question:a} = await hb({question:{text:`${d ? a.replace(/\?$/, "") : a} (y/n)${d ? "?" : ""}`, defaultValue:b ? "y" : "n"}}, c));
  return "y" == a;
}
;const ib = util.inspect;
const R = (...a) => {
  let b = -1;
  return "%s%s".replace(/%s/g, () => {
    b++;
    return a[b];
  });
};
function jb(a, b) {
  let c = 0;
  const d = (f, g) => {
    const k = " ".repeat(2 * c);
    g = void 0 !== g ? K("+ " + S(g), "green") : null;
    f = void 0 !== f ? K("- " + S(f), "red") : null;
    const l = [];
    f && l.push(R(k, f));
    g && l.push(R(k, g));
    return l.join("\n");
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
      var l = g.valueOf();
      if (T(k) && T(l) && k != l) {
        return d(k, l);
      }
    }
    if (Array.isArray(f) && Array.isArray(g)) {
      let m;
      k = f.map((n, p) => {
        m = p;
        (n = h(n, g[p])) && (n = `${e(`[${p}]`)}\n${n}`);
        return n;
      }).filter(Boolean);
      l = g.slice(m + 1).map((n, p) => `${e(`[${m + p + 1}]`)}\n${d(void 0, n)}`);
      return [...k, ...l].join("\n");
    }
    if ("object" == typeof f && "object" == typeof g) {
      const m = [], n = [], p = [];
      Object.keys(f).forEach(q => {
        q in g ? p.push(q) : n.push(q);
      });
      Object.keys(g).forEach(q => {
        q in f || m.push(q);
      });
      k = n.map(q => {
        let r = S(f[q]);
        return d(`${q}${`: ${r}`}`);
      });
      l = m.map(q => d(void 0, `${q}: ${S(g[q])}`));
      const t = p.map(q => {
        c++;
        const r = h(f[q], g[q]);
        let u = "";
        r && (u += e(Array.isArray(f[q]) && Array.isArray(g[q]) ? `${q}.Array` : q), u += "\n" + r);
        c--;
        return u;
      }).filter(Boolean);
      return [...k, ...l, ...t].join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", f, g);
  };
  return h(a, b);
}
const T = a => null === a ? !0 : "string number boolean symbol null undefined".split(" ").includes(typeof a), S = a => Array.isArray(a) ? `Array[${a.toString()}]` : a && a.toString ? a.toString() : `${a}`;
async function kb(a) {
  a = sa(a);
  return await Ga(a);
}
;async function lb(a, b) {
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
;async function mb(a) {
  const b = B(a);
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
      const c = B(a);
      await U(c);
      await U(a);
    } else {
      if ("EEXIST" != b.code) {
        throw b;
      }
    }
  }
}
;const nb = (a, b) => {
  a = " ".repeat(Math.max(a - b.length, 0));
  return `${b}${a}`;
}, ob = a => {
  a = a.split("\n");
  const b = {}.width || a.reduce((c, {length:d}) => d > c ? d : c, 0);
  return a.map(nb.bind(null, b)).join("\n");
};
function pb(a) {
  const {padding:b = 1} = {};
  var c = a.split("\n").reduce((h, {length:f}) => f > h ? f : h, 0) + 2 * b;
  const d = `\u250c${"\u2500".repeat(c)}\u2510`;
  c = `\u2514${"\u2500".repeat(c)}\u2518`;
  const e = " ".repeat(b);
  a = ob(a).split("\n").map(h => `\u2502${e}${h}${e}\u2502`).join("\n");
  return `${d}\n${a}\n${c}`;
}
;async function V(a, b, c) {
  a = E(a.a, b);
  await mb(a);
  /\.json$/.test(a) ? (c = JSON.stringify(c, null, 2), await lb(a, c)) : await lb(a, c);
}
async function qb(a, b, c, d) {
  if (!c) {
    throw Error("Give snapshot to save");
  }
  if (await a.prompt(c, d)) {
    await V(a, b, c);
  } else {
    throw Error("Could not test missing snapshot");
  }
}
async function rb(a, b, c, d, e = !1) {
  if (!c) {
    throw Error("Pass the actual value for snapshot.");
  }
  const h = I(!0), f = /\.json$/.test(b);
  let g;
  try {
    if (g = await a.read(b), f) {
      var k = g;
      try {
        cb(c, k, void 0);
      } catch (m) {
        const n = jb(k, c);
        m.message = [m.message, n].filter(Boolean).join("\n");
        throw m;
      }
    } else {
      db(c, g);
    }
  } catch (m) {
    if ("ENOENT" == m.code) {
      await qb(a, b, c, d);
    } else {
      var l;
      f || (l = Pa(g, c));
      if (e && (f ? console.log(m.message) : console.log(l), await Q(`Update snapshot${d ? ` for ${d}` : ""}?`))) {
        await V(a, b, c);
        return;
      }
      if (!f) {
        throw !e && console.log(l), a = h("The string didn't match the snapshot."), a.J = l, a;
      }
      throw h(m);
    }
  }
}
class sb {
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
      process.stdout.isTTY && process.stdout.columns - 4 >= c ? console.log(pb(a)) : console.log(a);
    } else {
      console.log(ib(a, {colors:!0}));
    }
    return await Q(`Save snapshot${b ? ` for ${b}` : ""}?`);
  }
  async read(a) {
    a = E(this.a, a);
    return /\.json$/.test(a) ? (a = await kb(a), JSON.parse(a)) : await kb(a);
  }
}
;const W = async a => {
  try {
    return await N(F, a);
  } catch (b) {
    return null;
  }
};
async function tb(a, b) {
  b = b.map(async c => {
    const d = C(a, c);
    return {lstat:await N(F, d), path:d, relativePath:c};
  });
  return await Promise.all(b);
}
const ub = a => a.lstat.isDirectory(), vb = a => !a.lstat.isDirectory();
async function wb(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  const {ignore:b = []} = {};
  if (!(await N(F, a)).isDirectory()) {
    var c = Error("Path is not a directory");
    c.code = "ENOTDIR";
    throw c;
  }
  c = await N(G, a);
  var d = await tb(a, c);
  c = d.filter(ub);
  d = d.filter(vb).reduce((e, h) => {
    var f = h.lstat.isDirectory() ? "Directory" : h.lstat.isFile() ? "File" : h.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return {...e, [h.relativePath]:{type:f}};
  }, {});
  c = await c.reduce(async(e, {path:h, relativePath:f}) => {
    const g = D(a, h);
    if (b.includes(g)) {
      return e;
    }
    e = await e;
    h = await wb(h);
    return {...e, [f]:h};
  }, {});
  return {content:{...d, ...c}, type:"Directory"};
}
;const xb = async a => {
  await N(wa, a);
}, yb = async a => {
  const {content:b} = await wb(a);
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
  c = c.map(e => C(a, e));
  await Promise.all(c.map(xb));
  d = d.map(e => C(a, e));
  await Promise.all(d.map(yb));
  await N(va, a);
}, zb = async a => {
  (await N(F, a)).isDirectory() ? await yb(a) : await xb(a);
};
const Ab = a => a.replace(/^!/, ""), Bb = async(a, b, c, d = "", e = [], h = !1, f = "txt") => {
  var g = b.replace(/^!/, "");
  const k = g.replace(/ /g, "-");
  b = "string" == typeof a;
  const l = `${k}.${b ? f : "json"}`;
  let m = C(...c.map(Ab));
  (c = e.find(n => {
    n = C(...n.split("/"));
    return m.startsWith(n);
  })) && (m = m.slice(c.length));
  e = C(d, m);
  d = C(e, l);
  if (a) {
    if (c = new sb, c.a = e, f = C(e, `${k}.${b ? "json" : f}`), await W(f)) {
      g = `Snapshot of another type exists: ${K(f, "red")}`, h || X(g), console.log("%s.\nNew data:", g), console.log(b ? a : ib(a, {colors:!0})), await Q(`Update snapshot ${K(f, "yellow")} to a new type?`) || X(g), await V(c, l, a), await zb(f);
    } else {
      try {
        await rb(c, l, a, K(g, "yellow"), h);
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
async function Cb(a, b, {name:c, context:d, fn:e, timeout:h, persistentContext:f}, g = {}, k = null) {
  a && a({name:c, type:"test-start"});
  let l, m, n;
  d = Array.isArray(d) ? d : [d];
  d.forEach(r => {
    r.prototype instanceof Y && (l = r.snapshotExtension, n = r.serialise);
  });
  d = (e.name ? d.slice(0, e.length) : d).map(r => {
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
      t = await ab({context:d, persistentContext:f, fn:e, timeout:h, onCatchment(w) {
        p = w;
      }});
      let {result:r, error:u} = t;
      k || (k = u);
      if (!k) {
        try {
          void 0 !== r && n && (r = n(r)), await Bb(r, m || c, b, g.j, g.l, g.g, l);
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
  a && a({name:c, error:k, type:"test-end", result:Db({error:k, name:c})});
  return t;
}
function Db({error:a, name:b}) {
  return null === a ? `${Ra} ${b}` : `${Sa} ${b}` + v + M(Qa({error:a, name:b}), " | ");
}
async function Eb(a, b, {name:c, tests:d, persistentContext:e}, h, f, g) {
  a && a({type:"test-suite-start", name:c});
  let k, l;
  if (e && !g) {
    try {
      k = await Fb(e), Gb(d, k);
    } catch (m) {
      m.message = `Persistent context failed to evaluate: ${m.message}`, m.stack = m.stack.split("\n", 2).join("\n"), g = m;
    }
  }
  try {
    const m = [...b, c.replace(/\.jsx?$/, "")];
    l = await Hb(a, m, d, h, f, g);
    a && a({type:"test-suite-end", name:c});
  } finally {
    if (k) {
      try {
        await Ib(k);
      } catch (m) {
        m.stack = m.stack.split("\n", 2).join("\n"), console.log(K(m.stack, "red"));
      }
    }
  }
  return l;
}
const Gb = (a, b) => {
  a.forEach(c => {
    c.persistentContext = b;
  });
}, Jb = async a => {
  const b = Za(a);
  return await O(b, a.o || 5000, `Evaluate persistent context ${a.name ? a.name : ""}`);
}, Fb = async a => {
  a = Array.isArray(a) ? a : [a];
  return await Promise.all(a.map(b => Jb(b)));
}, Kb = async a => {
  const b = P([a]);
  return await O(b, a.o || 5000, `Destroy persistent context ${a.name ? a.name : ""}`);
}, Ib = async a => await Promise.all(a.map(b => Kb(b)));
async function Hb(a, b, c, d, e, h) {
  return await bb(c, {onlyFocused:d, runTest(f) {
    return Cb(a, b, f, e, h);
  }, runTestSuite(f, g) {
    return Eb(a, b, f, d ? g : !1, e, h);
  }});
}
;class Lb {
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
;function Mb({s:a}) {
  return a instanceof Z;
}
const Nb = a => a.some(b => b.startsWith("!") || b.startsWith("$")), Ob = a => a.reduce((b, c) => c instanceof Z ? [...b, c.name, ...c.G] : [...b, c.name], []);
function Pb(a, b) {
  if (Array.isArray(b) || "function" == (typeof b).toLowerCase()) {
    return a.a = b, !0;
  }
  if ("object" == (typeof b).toLowerCase()) {
    return a.a = Object.freeze({...a.a || {}, ...b}), !0;
  }
}
class Z {
  constructor(a, b, c, d, e) {
    if (!a) {
      throw Error("Test suite name must be given.");
    }
    this.H = a;
    this.I = c;
    this.o = e || (Mb(this) ? this.s.timeout : void 0);
    this.a = this.v = void 0;
    !Pb(this, d) && Mb(this) && (this.a = c.context);
    if ("object" != typeof b) {
      throw Error("You must provide tests in an object.");
    }
    this.w = !1;
    this.m = [];
    this.u = [];
    {
      const {context:h, persistentContext:f, ...g} = b;
      void 0 !== h && Pb(this, h);
      void 0 !== f && (a = f, Array.isArray(a) ? this.v = a : "function" == (typeof a).toLowerCase() && (this.v = a));
      this.m = Qb(g, this);
      this.u = Ob(this.m);
      this.w = Nb(this.u);
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
const Rb = ({name:a}, {name:b}) => "default" == a ? -1 : "default" == b ? 1 : 0;
function Sb(a) {
  const b = [], c = [];
  a.forEach(d => {
    d instanceof Lb ? c.push(d) : b.push(d);
  });
  a = b.sort(Rb);
  return [...c, ...a];
}
function Qb(a, b) {
  const c = Object.keys(a).map(d => {
    const e = a[d];
    if (e instanceof Z) {
      return e;
    }
    switch(typeof e) {
      case "function":
        return new Lb(d, e, b.timeout, b.context);
      case "object":
        return new Z(d, e, b);
    }
  }).filter(d => d);
  return Sb(c);
}
;function Tb() {
  Object.keys(require.cache).forEach(a => {
    D("", a).startsWith("node_modules") || a == require.resolve("../") || delete require.cache[a];
  });
}
const Vb = async(a, b) => {
  a = await a.reduce(async(c, d) => {
    c = await c;
    const e = await Ub(d);
    return e ? {...c, [d]:e} : c;
  }, {});
  return new Z("Zoroaster Root Test Suite", a, null, void 0, b);
};
async function Wb(a) {
  return (await N(G, a)).reduce(async(b, c) => {
    b = await b;
    const d = C(a, c), e = await N(F, d);
    let h;
    if (e.isFile()) {
      var f = E(d);
      f = require(f);
      h = c.replace(/\.jsx?$/, "");
    } else {
      e.isDirectory() && (f = await Wb(d), h = c);
    }
    return b[h] ? (console.warn("Merging %s with %s in %s", h, c, a), b[h] = Xb(b[h], f), b) : {...b, [h]:f};
  }, {});
}
const Xb = (a, b) => {
  Object.keys(b).forEach(c => {
    if (a[c]) {
      throw Error(`Duplicate key ${c}`);
    }
  });
  return {...a, ...b};
};
async function Ub(a) {
  try {
    const b = await N(F, a);
    if (b.isFile()) {
      const c = E(a);
      return require(c);
    }
    if (b.isDirectory()) {
      return await Wb(a);
    }
  } catch (b) {
    throw b.message += `\n${K("Could not require ", "red") + L(K(a, "white"), "red")}`, b;
  }
}
;function Yb(a, b) {
  a.forEach(c => {
    ya(c, (...d) => {
      b(c, ...d);
    });
  });
}
function Zb(a) {
  a.forEach(b => {
    xa(b);
  });
}
async function $b({paths:a, watch:b, timeout:c, j:d, l:e, g:h}, {B:f = [], F:g} = {}) {
  Zb(f);
  g && process.removeListener("beforeExit", g);
  f = await Vb(a, c);
  const k = Ta();
  g = Va();
  const l = Ua();
  k.pipe(l).pipe(process.stdout);
  k.pipe(g);
  ({h:g} = new J({rs:g}));
  var m = 0, n = 0;
  await Hb(t => {
    "object" == typeof t && (k.write(t), "test-end" == t.type && (m++, t.error && n++));
  }, [], f.tests, f.hasFocused, {j:d, l:e, g:h});
  k.end();
  f = await g;
  process.stdout.write(v);
  process.stdout.write(f);
  process.stdout.write(`\ud83e\udd85  Executed ${m} test${1 == m ? "" : "s"}`);
  n && process.stdout.write(`: ${n} error${1 < n ? "s" : ""}`);
  process.stdout.write(`.${v}`);
  const p = () => {
    process.exit(n);
  };
  process.once("beforeExit", p);
  if (b) {
    const t = Object.keys(require.cache).filter(q => !q.startsWith(`${process.cwd()}/node_modules/`));
    Yb(t, async(q, r) => {
      const u = a.filter(w => E(w) != q || r.mtime.getTime() ? !0 : (console.warn("Test suite file %s was deleted.", K(w, "yellow")), !1));
      Tb();
      await $b({paths:u, watch:b, timeout:c, j:d, l:e, g:h}, {B:t, F:p});
    });
  }
}
;function ac() {
  const {usage:a = {}, description:b, line:c, example:d} = {usage:bc, description:"A testing framework with support for test contexts and masks.\nAutomatically transpiles import/export and JSX with \u00c0LaMode.\nhttps://artdecocode.com/zoroaster/", line:"zoroaster path [pathN] [-w] [-ab] [-sr] [-vh]", example:"zoroaster test/spec test/mask -a"};
  var e = Object.keys(a);
  const h = Object.values(a), [f] = e.reduce(([l = 0, m = 0], n) => {
    const p = a[n].split("\n").reduce((t, q) => q.length > t ? q.length : t, 0);
    p > m && (m = p);
    n.length > l && (l = n.length);
    return [l, m];
  }, []), g = (l, m) => {
    m = " ".repeat(m - l.length);
    return `${l}${m}`;
  };
  e = e.reduce((l, m, n) => {
    n = h[n].split("\n");
    m = g(m, f);
    const [p, ...t] = n;
    m = `${m}\t${p}`;
    const q = g("", f);
    n = t.map(r => `${q}\t${r}`);
    return [...l, m, ...n];
  }, []).map(l => `\t${l}`);
  const k = [b, `  ${c || ""}`].filter(l => l ? l.trim() : l).join("\n\n");
  e = `${k ? `${k}\n` : ""}
${e.join("\n")}
`;
  return d ? `${e}
  Example:

    ${d}
` : e;
}
;if (pa) {
  console.log(require("../../package.json").version), process.exit();
} else {
  if (qa) {
    var cc, bc = fa();
    cc = ac();
    console.log(cc);
    process.exit();
  }
}
if (ja) {
  try {
    require("@babel/register");
  } catch (a) {
    const b = E(process.cwd(), "node_modules/@babel/register");
    require(b);
  }
}
ia && require("alamode")();
(async() => {
  try {
    await $b({paths:[...ha || [], ...ra], watch:ka, timeout:la, j:ma, l:na.split(","), g:oa});
  } catch (a) {
    console.log(y(a.stack)), process.exit(1);
  }
})();

