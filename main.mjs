#!/usr/bin/env node
import Vorpal from "vorpal";
import path from "path";
const vorpal = Vorpal();

import langs from "./langs/index.mjs";
import commands from "./commands/index.mjs";
const langKeys = Object.keys(langs);
vorpal;
const validate = (args) => {
  args.main = path.resolve(args.main);
  args.lang = path.extname(args.main).slice(1);
  args.asset ??= path.join(path.dirname(args.main), "assets." + args.lang);
  args.asset = path.resolve(args.asset);
  args.bundle = path.resolve(args.bundle);
  if (!langKeys.includes(args.lang))
    return (
      "unsuported language " +
      args.lang +
      ", must be one of: " +
      langKeys.join(", ")
    );
  args.lang = langs[args.lang];
  return true;
};

//.name("tic-bundler")
//.description("Tool to bundle your Tic80 games")
//.version("0.1.0");

vorpal
  .command("watch <bundle> <main> [asset] ")
  .description("watch and compile in both direction")
  .option("--tic <tic>", "path to tic80")
  .validate(validate)
  .action(commands.watch);

vorpal
  .command("bundle <bundle> <main> [asset] ")
  .description("bundle current game into one file")
  .validate(validate)
  .action(commands.bundle);

vorpal
  .command("unbundle <bundle> <main> [asset] ")
  .description("extract game source from one file")
  .validate(validate)
  .action(commands.unbundle);

if (process.argv.length > 2) vorpal.parse(process.argv);
else vorpal.delimiter("tic-bundler$").show();
