import { defaults } from "jest-config";
/** @type {import('jest').Config} */
const config = {
  transform: {},
  testMatch: ["**/*?(*.)+(spec|test).[tj]s?(x)"],
  verbose: true,
};

export default config;
