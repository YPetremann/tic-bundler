import GenericTransformer from "./GenericTransformer.mjs";

const prelude = `do
  local m,p={},{}
  function load(name,module) m[name]=module end
  function require(name)
    if not p[name] and m[name] then m[name],p[name]=m[name](require),true end
    return m[name]
  end
end

`;

class JSTransformer extends GenericTransformer {
  ReRequire = /require\("([^"]+)"\)/g;
  require = (pth) => `require("${pth}")`;

  ReModule = /\nload\("([^"]+)",function\(require\)\n  ((?:.|\n)+?\n)end\)\n/gm;
  ReAsset = /\n(-- <[A-Z0-9]+>\n(?:.|\n)*\n-- <\/[A-Z0-9]+>\n)/gm;
  load = (pth, src) => `load("${pth}",function(require)\n  ${src}\nend)\n\n`;

  prelude = prelude;
}

export default new JSTransformer();
