#!/usr/bin/env node

const fs = require('fs');
const path = require("path");
const _ = require("lodash");

const minimist = require("minimist");
const chalk = require("chalk");

const { log } = console;

module.exports = (() => {
  const args = minimist(process.argv.slice(2));
  console.log(args);

  let cmd = args._[0] || "help";

  if (args.version || args.v) {
      cmd = 'version';
  } 
  if (args.help || args.h) {
      cmd = 'help';
  }
  console.log('cmd', cmd);
  switch (cmd) {
    case 'extractNetworks':
      require('./network/extract-network-info.js')(args);
      break;
    case 'injectNetworks':
      require('./network/inject-network-info.js')(args);
      break;
      case 'version': 
      require('./generic/version')(args);
      break;
      case 'help':
      require('./generic/help')(args);
      break;
    default:
      console.error(`${cmd} is not a valid command! Try out \`npx tnt help\` to access a list of valid commands`);
      break;
  }
})();
