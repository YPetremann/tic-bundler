#!/usr/bin/env node
import { program, Command } from "commander";
import path from "path";

import langs from "./langs/index.mjs";
import commands from "./commands/index.mjs";

const langKeys = Object.keys(langs);

/**
 * @param {Command} thisCommand
 * @param {Command} actionCommand
 */
const validate =
  (fn) =>
  (bundle, main, asset, { tic }) => {
    main = path.resolve(main);
    let lang = path.extname(main).slice(1);
    asset ??= path.join(path.dirname(main), "assets." + lang);
    asset = path.resolve(asset);
    bundle = path.resolve(bundle);
    if (!langKeys.includes(lang)) return;
    lang = langs[lang];
    const opts = { bundle, main, asset, lang, tic };
    return fn(opts);
  };
program
  .name("tic-bundler")
  .description("Tool to bundle your Tic80 games")
  .version("0.1.0");

program
  .command("watch")
  .description("watch and compile in both direction")
  .argument("<bundle>")
  .argument("<main>")
  .argument("[main]")
  .option("--tic <tic>", "path to tic80", "tic80")
  .action(validate(commands.watch));

program
  .command("bundle")
  .description("bundle current game into one file")
  .argument("<bundle>")
  .argument("<main>")
  .argument("[main]")
  .action(validate(commands.bundle));

program
  .command("unbundle")
  .description("extract game source from one file")
  .argument("<bundle>")
  .argument("<main>")
  .argument("[main]")
  .action(validate(commands.unbundle));

program.parse();
