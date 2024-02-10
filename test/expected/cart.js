// script: js

const m = {};
const p = {};
function load(name, module) {
  m[name] = module;
}
function require(name) {
  if (!p[name] && m[name]) {
    m[name] = m[name](require);
    p[name] = true;
  }
  return m[name];
}

load("lib_b/module.js", function (require) {
  const mod = require("lib_a/module.js");
  return mod + " World";
});

load("lib_a/module.js", function (require) {
  return "Hello";
});

const mod = require("lib_b/module.js");

function BOOT() {
  cls(0);
  trace(mod);
}

function TIC() {
  print(mod, 1, 1, 1);
}

// <PALETTE>
// 000:1a1c2c5d275db13e53ef7d57ffcd75a7f07038b76425717929366f3b5dc941a6f673eff7f4f4f494b0c2566c86333c57
// </PALETTE>
