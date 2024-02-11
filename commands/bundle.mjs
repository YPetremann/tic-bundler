import fs from "fs";
import path from "path";

const writeFile = ([name, content]) =>
  content &&
  fs.promises
    .mkdir(path.dirname(name), { recursive: true })
    .then(() => fs.promises.writeFile(name, content));

export async function bundle(opts) {
  const { bundle, main, asset, lang } = opts;
  try {
    const files = await lang.bundle(main, asset, bundle);
    await Promise.all(Object.entries(files).map(writeFile));
  } catch (e) {
    console.error("Bundle aborted :");
    console.error(e.stack);
  }
}
