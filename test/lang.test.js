import { expect, test, describe, beforeEach, beforeAll } from "bun:test";
import langs from "../langs/index.mjs";

const EXTS = [
  "fnl",
  "janet",
  "js",
  "lua",
  "moon",
  "nut",
  "py",
  "rb",
  "scm",
  "wren",
];
const runExpected = "\n loading cart...\nHello World";

for (const EXT of EXTS) {
  const DIR = import.meta.dir;
  const LANG = langs[EXT];
  const CART = `${DIR}/expected/cart.${EXT}`;
  const MAIN = `${DIR}/source/main.${EXT}`;
  const MODA = `${DIR}/source/lib_a/module.${EXT}`;
  const MODB = `${DIR}/source/lib_b/module.${EXT}`;
  const MODC = `${DIR}/source/lib_c/module.${EXT}`;
  const ASSET = `${DIR}/source/assets.${EXT}`;

  const splitNl = ([n, c]) => [n, c.split("\n")];
  const loadF = (f) =>
    Bun.file(f)
      .text()
      .then((c) => [f, c]);
  const format = (f) => Object.fromEntries(Object.entries(f).map(splitNl));
  const load = (files) =>
    Promise.all(files.map(loadF)).then(Object.fromEntries);

  describe(EXT, () => {
    beforeAll(async () => {
      const tic = Bun.spawn(["tic80", "--cli", CART]);
      const results = await new Response(tic.stdout).text();
      if (results !== runExpected) return new Error("Cart invalid");
    });
    test(`run`, () => {});
    test.if(LANG !== undefined)(`bundle`, async () => {
      const expected = await load([CART]);
      const results = await LANG.bundle(MAIN, ASSET, CART);
      expect(format(results)).toEqual(format(expected));
    });

    test.if(LANG !== undefined)(`unbundle`, async () => {
      const expected = await load([MAIN, ASSET, MODA, MODB, MODC]);
      const results = await LANG.unbundle(MAIN, ASSET, CART);
      expect(format(results)).toEqual(format(expected));
    });
  });
}
