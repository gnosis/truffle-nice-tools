#!/usr/bin/env node
require('dotenv').load();
const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const minimist = require("minimist");
const chalk = require("chalk");

const { log } = console;

module.exports = (() => {
  const args = minimist(process.argv.slice(2));

  let cmd = args._[0] || "help";

  if (args.version || args.v) {
    cmd = "version";
  }
  if (args.help || args.h) {
    cmd = "help";
  }

  switch (cmd) {
    case "eN":
    case "extractNetworks":
      require("./network/extract-network-info.js")(args);
      break;
    case "iN":
    case "injectNetworks":
      require("./network/inject-network-info.js")(args);
      break;
    case "mG":
    case "measureGas":
      require('./gas/measureGas.js')(args);
      break;
    case "dT":
    case "decodeTransactions":
      require('./decode/decode-transactions.js')(args);
      break;
    case "cI":
    case "createInterface":
      require('./abi/create-interface.js')(args);
      break;
    case "cB":
    case "cleanBuild":
      require('./contract/clean-build.js')(args);
      break;
    case "version":
      require("./generic/version")(args);
      break;
    case "help":
      require("./generic/help")(args);
      break;
    default:
      console.error(
        `${chalk.red.bold(cmd)} ${chalk.bold(
          "is not a valid command! Try"
        )} ${chalk.red.bold("tnt help")} ${chalk.bold(
          "to access a list of valid commands"
        )}`
      );
      break;
  }
})();
