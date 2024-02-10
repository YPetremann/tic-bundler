import fs from "fs";
import path from "path";
import child_process from "child_process";
import chokidar from "chokidar";

const log = console.log.bind(console);
const watchOpts = { ignoreInitial: true, cwd: process.cwd() };
const timeout = (ms) => new Promise((r) => setTimeout(r, ms));
const writeFile = ([name, content]) =>
  fs.promises
    .mkdir(path.dirname(name), { recursive: true })
    .then(() => fs.promises.writeFile(name, content));
export function watch(opts) {
  const { bundle, main, asset, lang, tic } = opts;
  const dir = path.dirname(main);
  let freeze = false;
  let started = false;
  async function packAndStart(msg) {
    if (!fs.existsSync(bundle)) await pack(msg);
    start();
  }
  function start() {
    if (started) return;
    started = true;
    const bDir = path.dirname(bundle);
    const cp = child_process.spawn(tic, ["--skip", `--fs=${bDir}`, bundle], {
      stdio: "inherit",
    });
    console.log("tic start");
    cp.on("close", () => {
      process.exit();
    });
  }
  async function pack(msg) {
    if (freeze) return log("ignored pack : " + msg);
    freeze = true;
    log("pack: " + msg);
    const files = await lang.bundle(main, asset, bundle);
    await Promise.all(Object.entries(files).map(writeFile));
    await timeout(100);
    freeze = false;
    start();
  }
  async function unpack(msg) {
    if (freeze) return log("ignored unpack : " + msg);
    freeze = true;
    log("unpack: " + msg);
    const files = await lang.unbundle(main, asset, bundle);
    await Promise.all(Object.entries(files).map(writeFile));
    await timeout(100);
    freeze = false;
    start();
  }
  const bundleWatcher = chokidar
    .watch(bundle, { ...watchOpts })
    .on("ready", () => log("ready"))
    .on("add", () => log(`Bundle added`))
    .on("change", () => unpack(`Bundle updated`))
    .on("unlink", () => pack(`Bundle removed`));

  const codeWatcher = chokidar
    .watch([dir, asset], { ignored: [bundle], ...watchOpts })
    .on("ready", () => packAndStart("ready"))
    .on("add", (path) => pack(`File ${path} added`))
    .on("change", (path) => pack(`File ${path} changed`))
    .on("unlink", (path) => pack(`File ${path} removed`));
}
