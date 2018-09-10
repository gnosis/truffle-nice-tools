// user imports map
const fs = require("fs");
const chalk = require("chalk");

module.exports = args => {
  let importFile;

  if (!args.f) {
    console.log(chalk.red.bold("No input file provided."), chalk.yellow.bold(" Running without an inheritance map input file."));
  }
  if (fs.existsSync(args.f)) {
    importFile = JSON.parse(fs.readFileSync(args.f, "utf8"));
    console.log('Inheritance Map: ', importFile);
  } else {
    importFile = JSON.parse('{"map": ["none"]}');
  }
  let inheritanceMap = [];
  for (var key in importFile) {
    inheritanceMap.push([key, importFile[key]]);
  }
  return inheritanceMap;
};
