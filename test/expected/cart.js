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

load("lib_c/module.js", function (require) {
  const hello = require("lib_a/module.js");
  const world = require("lib_b/module.js");
  return hello + " " + world;
});

load("lib_a/module.js", function (require) {
  return "Hello";
});

load("lib_b/module.js", function (require) {
  return "World";
});

const mod = require("lib_c/module.js");

function BOOT() {
  trace(mod);
  exit();
}

function TIC() {}

// <PALETTE>
// 000:1a1c2c5d275db13e53ef7d57ffcd75a7f07038b76425717929366f3b5dc941a6f673eff7f4f4f494b0c2566c86333c57
// </PALETTE>
