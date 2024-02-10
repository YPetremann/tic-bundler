#!/usr/bin/env node
import { program, Argument } from "commander";

import langs from "../langs/index.mjs";
import { build } from "./build.mjs";
import { watch } from "../watch.mjs";

const langArg = new Argument("<lang>", "language used for the game")
  .choices(Object.keys(langs))
  .argParser((name) => langs[name]);

program
  .name("tic-bundler")
  .description("Tool to bundle your Tic80 games")
  .version("0.1.0");

program
  .command("watch")
  .addArgument(langArg)
  .argument("<game>")
  .argument("<asset>")
  .argument("<output>")
  .option("--tic <tic>")
  .action(watch);

program
  .command("bundle")
  .addArgument(langArg)
  .argument("<game>")
  .argument("<asset>")
  .argument("<output>")
  .action(build);

program
  .command("unbundle")
  .addArgument(langArg)
  .argument("<game>")
  .argument("<asset>")
  .argument("<output>")
  .action(build);

program.parse();
