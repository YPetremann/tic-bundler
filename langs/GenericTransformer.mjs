import path from "path";
import fs from "fs";

export default class GenericTransformer {
  ReRequire = /require\("([^"]+)"\)/g;
  WrRequire = (pth) => `require("${pth}")`;
  ReModule = /\nload\("([^"]+)",function\(require\)\n  ((?:.|\n)+?\n)end\)\n/gm;
  ReAsset = /\n(-- <[A-Z0-9]+>\n(?:.|\n)*\n-- <\/[A-Z0-9]+>\n)/gm;
  WrLoad = (pth, src) => `load("${pth}",function(require)\n  ${src}\nend)\n\n`;
  WrPrelude = () => prelude;

  #requireChild = (main, mod) => (_, child) =>
    this.WrRequire(path.relative(main.dir, path.resolve(mod.dir, child)));
  #requireToRelative = (name) => (_, pth) =>
    this.WrRequire(path.relative(path.dirname(name), pth));

  async #discover(mod, modules) {
    try {
      mod.source = await fs.promises.readFile(mod.path, { encoding: "utf-8" });
    } catch (e) {
      console.warn("not found: " + path.relative(process.cwd(), mod.path));
      mod.source = "";
    }
    mod.dir = path.dirname(mod.path);
    let requires = mod.source.matchAll(new RegExp(this.ReRequire));
    requires = [...requires];
    requires = requires.map(([, name]) => ({
      path: path.resolve(mod.dir, name),
    }));
    requires = requires.filter(
      ({ path }, i, a) => i == a.findIndex((mod) => path == mod.path)
    );
    requires = requires.filter(
      ({ path }) => !modules.find((mod) => path == mod.path)
    );
    modules.push(...requires);
    return requires.length;
  }

  #transformModule(mod, modules, main) {
    if (mod.source == "") return;
    mod.source = this.WrLoad(
      path.relative(main.dir, mod.path),
      mod.source
        .replaceAll("\n", "\n  ")
        .replaceAll(/\n  $/g, "")
        .replaceAll(this.ReRequire, this.#requireChild(main, mod))
    );
  }

  #transformAsset(mod, modules) {
    mod.source = "\n" + mod.source;
  }

  #transformMain(main, modules, assets, bundle) {
    for (const mod of modules) this.#transformModule(mod, modules, main);
    for (const asset of assets) this.#transformAsset(asset, assets, main);

    const match = this.ReRequire.exec(main.source);
    if (!match) return { [bundle]: main.source };

    const pos = main.source.lastIndexOf("\n", match.index) + 1;
    const before = main.source.slice(0, pos);
    const prelude = this.WrPrelude();
    const register = modules.map((m) => m.source).join("");
    const after = main.source.slice(pos);
    const cassets = assets.map((m) => m.source).join("");
    const src = [before, prelude, register, after, cassets].join("");
    return { [bundle]: src };
  }

  #extractAsset = (modules, res) => (_, asset) => {
    modules[res] = asset;
    return "";
  };

  #extractModule = (dir, modules) => (_, name, content) => {
    const pth = path.resolve(dir, name);
    modules[pth] = content
      .replaceAll("\n  ", "\n")
      .replaceAll(this.ReRequire, this.#requireToRelative(name));
    return "";
  };

  async bundle(code, res, bundle) {
    const modules = [{ path: code }];
    const assets = [{ path: res }];

    await this.#discover(assets[0], assets);
    for (let i = 0; i < modules.length; i++)
      await this.#discover(modules[i], modules);

    const first = modules.shift();
    const result = this.#transformMain(first, modules, assets, bundle);
    return result;
  }

  async unbundle(code, res, bundle) {
    const dir = path.dirname(code);
    const content = await fs.promises.readFile(bundle, { encoding: "utf-8" });

    const modules = {};
    modules[code] = content
      .replaceAll(this.WrPrelude(), "")
      .replaceAll(this.ReModule, this.#extractModule(dir, modules))
      .replaceAll(this.ReAsset, this.#extractAsset(modules, res));
    return modules;
  }
}
