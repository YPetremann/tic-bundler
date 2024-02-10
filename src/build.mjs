export function build(lang, entry, assets) {
  console.log("build", lang, entry, assets);
  console.log(lang.build(entry, assets));
}
