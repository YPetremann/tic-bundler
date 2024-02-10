import GenericTransformer from "./GenericTransformer.mjs";

const prelude = `const m = {};
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

`;

class JSTransformer extends GenericTransformer {
  ReRequire = /require\("([^"]+)"\)/g;
  require = (pth) => `require("${pth}")`;

  ReModule =
    /\nload\("([^"]+)", function \(require\) {\n  ((?:.|\n)+?\n)}\);\n/gm;
  ReAsset = /\n(\/\/ <[A-Z0-9]+>\n(?:.|\n)*\n\/\/ <\/[A-Z0-9]+>\n)/gm;
  load = (pth, src) => `load("${pth}", function (require) {\n  ${src}\n});\n\n`;

  prelude = prelude;
}

export default new JSTransformer();
