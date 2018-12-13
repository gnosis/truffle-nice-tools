/* eslint-disable no-console */
require("dotenv").load();
const { execSync, spawnSync } = require("child_process");
const fs = require('fs-extra')
const path = require("path");
const _ = require("lodash");
const chalk = require("chalk");
const inheritanceMapFunction = require("./getInheritanceMap.js");
const gasFixtures = require('./gasFixtures.js');

module.exports = args => {
  const inheritanceMap = inheritanceMapFunction(args);
  gasFixtures.generateGasTests();

  let gasStatsFile = args.o || path.join("build", "gas", "gas-stats.json");
  let gasMockTestingDirectory;
  if (process.env.BUILDGASFILE) {
    gasStatsFile = process.env.BUILDGASFILE
  }  
  if (process.env.GASTESTTESTINGDIRECTORY) {
    gasMockTestingDirectory = process.env.GASTESTTESTINGDIRECTORY
  }

  try {
    fs.unlinkSync(gasStatsFile);
  } catch (e) {
    if (e.code !== "ENOENT") {
      console.warn(`Could not delete ${gasStatsFile}: ${e}`);
    }
  }

  const newEnv = Object.assign({}, process.env);
  newEnv.COLLECT_GAS_STATS = true;
  newEnv.GAS_STATS_FILE = gasStatsFile;
  
  // // THESE ARE SUPPOSED TO BE REMOVED. They just exist to shwo what is happening in the fixtures. 
  // var dirList = execSync('ls .hiddenOilWell', { stdio: 'pipe', env: newEnv, encoding: 'utf-8', maxBuffer: 10e19 });
  // console.log('DIRLIST', dirList.toString());
  // var dirList = execSync('cat .hiddenOilWell/basic-thing.js', { stdio: 'pipe', env: newEnv, encoding: 'utf-8', maxBuffer: 10e19 });
  // console.log('FILELIST', dirList.toString());
  
  const testCommand = gasMockTestingDirectory || "truffle test .hiddenOilWell/**";
  try {
    execSync(testCommand, { stdio: "inherit", env: newEnv, maxBuffer: 10e19 });
  } catch (e) {
    console.log(`Could not execute the test command ${testCommand}: Error: ${e}`)
  } finally {
    fs.removeSync(gasFixtures.gasTestDirectory);
  }
  const gasStats = JSON.parse(fs.readFileSync(gasStatsFile));

  inheritanceMap.forEach(([parent, children]) => {
    const childrenData = children
      .map(name => gasStats[name])
      .filter(data => data);
    if (childrenData.length === 0) return;
    if (!gasStats[parent]) gasStats[parent] = {};

    _.mergeWith(
      gasStats[parent],
      ...childrenData,
      (objValue, srcValue) =>
        _.isArray(objValue) ? objValue.concat(srcValue) : undefined
    );
  });

  console.log("-- Gas stats --");

  _.forEach(gasStats, (contractData, contractName) => {
    if (!contractData) return;

    console.log(`Contract: ${contractName}`);
    _.forEach(contractData, (fnData, fnName) => {
      fnData.averageGasUsed =
        fnData.data.reduce((acc, datum) => acc + datum.gasUsed, 0) /
        fnData.data.length;
      const sortedData = _.sortBy(fnData.data, "gasUsed");
      fnData.min = sortedData[0];
      fnData.max = sortedData[sortedData.length - 1];
      fnData.median = sortedData[(sortedData.length / 2) | 0];
      console.log(`  ${fnName}:
    min: ${fnData.min.gasUsed}
    max: ${fnData.max.gasUsed}
    avg: ${fnData.averageGasUsed}
    med: ${fnData.median.gasUsed}`);
    });
    console.log();
  });

  fs.outputFileSync(gasStatsFile, JSON.stringify(gasStats, null, 2));
};
