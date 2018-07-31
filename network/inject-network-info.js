#!/usr/bin/env node
const ora = require("ora");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const error = require("../utils/error.js");
const chalk = require("chalk");
const { log } = console;

const dir = path.join("build", "contracts");
const contractNetworksMap = JSON.parse(fs.readFileSync("networks.json"));

module.exports = () => {
  const spinner = ora().start();
  _.toPairs(contractNetworksMap)
    .map(([name, networks]) => [path.join(dir, name + ".json"), networks])
    .filter(([file, _networks]) => {
      if (!fs.existsSync(file)) {
        error(
          chalk.red.bold(
            `ERROR: missing build artifact ${file}; make sure contracts are compiled, by running truffle compile`
          ), true
        );
      }
      return true
    })
    .forEach(([file, networks]) => {
      const artifactData = JSON.parse(fs.readFileSync(file));
      _.merge(artifactData.networks, networks);
      fs.writeFileSync(file, JSON.stringify(artifactData, null, 2));
    });
  log(
    chalk.green("Sucessfully injected network data into the build directory")
  );
  spinner.stop();
};
