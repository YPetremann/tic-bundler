import GenericTransformer from "./GenericTransformer.mjs";

const prelude = `local m = {};
local p = {};
function load(name, module) {
  m[name] <- module;
}
function require(name) {
  if (!(name in p) && (name in m)) {
    m[name] <- m[name](require);
    p[name] <- true;
  }
  return m[name];
}

`;

class JSTransformer extends GenericTransformer {
  ReRequire = /require\("([^"]+)"\)/g;
  WrRequire = (pth) => `require("${pth}")`;
  ReModule =
    /\nload\("([^"]+)", function \(require\) {\n  ((?:.|\n)+?\n)}\);\n/gm;
  ReAsset = /\n(\/\/ <[A-Z0-9]+>\n(?:.|\n)*\n\/\/ <\/[A-Z0-9]+>\n)/gm;
  WrLoad = (pth, src) =>
    `load("${pth}", function (require) {\n  ${src}\n});\n\n`;
  WrPrelude = () => prelude;
}

export default new JSTransformer();
