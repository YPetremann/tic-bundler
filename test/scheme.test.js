import { expect, test, beforeAll } from "bun:test";
import langs from "../langs/index.mjs";

const EXT = "scheme";

const DIR = import.meta.dir;
const LANG = langs[EXT];
const CART = `${DIR}/expected/cart.${EXT}`;
const MAIN = `${DIR}/source/main.${EXT}`;
const MOD1 = `${DIR}/source/lib_a/module.${EXT}`;
const MOD2 = `${DIR}/source/lib_b/module.${EXT}`;
const ASSET = `${DIR}/source/assets.${EXT}`;

const splitNl = ([n, c]) => [n, c.split("\n")];
const loadF = (f) =>
  Bun.file(f)
    .text()
    .then((c) => [f, c]);
const format = (f) => Object.fromEntries(Object.entries(f).map(splitNl));
const load = (files) => Promise.all(files.map(loadF)).then(Object.fromEntries);
const check = LANG !== undefined ? test : test.todo;

check(`bundle ${EXT}`, async () => {
  const expected = await load([CART]);
  const results = LANG.bundle(MAIN, ASSET, CART);
  expect(format(results)).toEqual(format(expected));
});

check(`unbundle ${EXT}`, async () => {
  const expected = await load([MAIN, ASSET, MOD1, MOD2]);
  const results = LANG.unbundle(MAIN, ASSET, CART);
  expect(format(results)).toEqual(format(expected));
});
