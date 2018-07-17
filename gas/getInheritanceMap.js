// user imports map
const fs = require("fs");
const chalk = require("chalk");

module.exports = args => {
  if (!args.f) {
    console.log(chalk.red.bold("No input file provided."), " Please provide an input File.");
  }
  
  let importFile = JSON.parse(fs.readFileSync(args.f, "utf8"));
  let inheritanceMap = [];
  for (var key in importFile) {
    inheritanceMap.push([key, importFile[key]]);
    // console.log("key", key, "value", inheritanceMap[key]);
  }
  return inheritanceMap;
};
