#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const argv = yargs(hideBin(process.argv)).option("port", {
  alias: "p",
  type: "number",
  description: "Port to run on",
  default: 3000,
}).argv;

// Import your app
require("../src/index.js")(argv.port);
