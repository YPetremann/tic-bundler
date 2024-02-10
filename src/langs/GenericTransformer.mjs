import path from "path";
import fs from "fs";

export default class GenericTransformer {
  requireChild = (main, mod) => (_, child) =>
    this.require(path.relative(main.dir, path.resolve(mod.dir, child)));
  requireToRelative = (name) => (_, pth) =>
    this.require(path.relative(path.dirname(name), pth));

  discover(mod, modules) {
    mod.source = fs.readFileSync(mod.path, { encoding: "utf-8" });
    mod.dir = path.dirname(mod.path);

    const requires = [...mod.source.matchAll(this.ReRequire)]
      .map(([, name]) => ({ path: path.resolve(mod.dir, name) }))
      .filter(({ path }, i, a) => i == a.findIndex((mod) => path == mod.path))
      .filter(({ path }) => !modules.find((mod) => path == mod.path));

    modules.push(...requires);
    return requires.length;
  }

  transformModule(mod, modules, main) {
    mod.source = this.load(
      path.relative(main.dir, mod.path),
      mod.source
        .replaceAll("\n", "\n  ")
        .replaceAll(/\n  $/g, "")
        .replaceAll(this.ReRequire, this.requireChild(main, mod))
    );
  }

  transformAsset(mod, modules) {
    mod.source = "\n" + mod.source;
  }

  transformMain(main, modules, assets, bundle) {
    for (const mod of modules) this.transformModule(mod, modules, main);
    for (const asset of assets) this.transformAsset(asset, assets, main);

    const match = this.ReRequire.exec(main.source);
    if (!match) return main.source;

    const pos = main.source.lastIndexOf("\n", match.index) + 1;
    const before = main.source.slice(0, pos);
    const register = modules.map((m) => m.source).join("");
    const after = main.source.slice(pos);
    const cassets = assets.map((m) => m.source).join("");
    const src = [before, this.prelude, register, after, cassets].join("");
    return { [bundle]: src };
  }

  bundle(code, res, bundle) {
    const modules = [{ path: code }];
    const assets = [{ path: res }];

    this.discover(assets[0], assets);
    for (let i = 0; i < modules.length; i++) this.discover(modules[i], modules);

    const first = modules.shift();
    return this.transformMain(first, modules, assets, bundle);
  }

  extractAsset = (modules, res) => (_, asset) => {
    modules[res] = asset;
    return "";
  };

  extractModule = (dir, modules) => (_, name, content) => {
    const pth = path.resolve(dir, name);
    modules[pth] = content
      .replaceAll("\n  ", "\n")
      .replaceAll(this.ReRequire, this.requireToRelative(name));
    return "";
  };

  unbundle(code, res, bundle) {
    const dir = path.dirname(code);
    const content = fs.readFileSync(bundle, { encoding: "utf-8" });

    const modules = {};
    modules[code] = content
      .replaceAll(this.prelude, "")
      .replaceAll(this.ReModule, this.extractModule(dir, modules))
      .replaceAll(this.ReAsset, this.extractAsset(modules, res));

    return modules;
  }
}
