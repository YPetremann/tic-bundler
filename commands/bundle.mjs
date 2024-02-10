import fs from "fs";
import path from "path";

const writeFile = ([name, content]) =>
  fs.promises
    .mkdir(path.dirname(name), { recursive: true })
    .then(() => fs.promises.writeFile(name, content));

export async function bundle(opts) {
  const { bundle, main, asset, lang } = opts;
  const files = await lang.bundle(main, asset, bundle);
  await Promise.all(Object.entries(files).map(writeFile));
}
