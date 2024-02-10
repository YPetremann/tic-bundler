import fs from "fs";
import path from "path";

const writeFile = ([name, content]) =>
  fs.promises
    .mkdir(path.dirname(name), { recursive: true })
    .then(() => fs.promises.writeFile(name, content));

export async function unbundle(args) {
  const { bundle, main, lang, asset } = args;
  const files = await lang.unbundle(main, asset, bundle);
  await Promise.all(Object.entries(files).map(writeFile));
}
