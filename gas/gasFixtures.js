"use strict";
const fs = require("fs-extra");
const path = require("path");
const walk = require("walk");
const prependFile = require("prepend-file");
const testDirectory = process.env.TESTDIR || path.join(__dirname, "../../../../test/");
const gasTestDirectory = process.env.GASTESTDIR || path.join(__dirname, "../../../../gasTests");

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var generateGasTests = () => {
  var options;
  if (!fs.existsSync(gasTestDirectory)) {
    fs.mkdirSync(gasTestDirectory);
    fs.copySync(testDirectory, gasTestDirectory);

    // walker options
    options = {
      listeners: {
        file: function(root, fileStats, next) {
          console.log(root);
          if (fileStats.name.match(/.js$/g)) {
            prependFile.sync(
              path.join(root, fileStats.name),
              'const gasTestingHiddenStats = require("@gnosis.pm/truffle-nice-tools").testGas;\n'
            );
            let contractsArr = [];
            var fileString = fs
              .readFileSync(path.join(root, fileStats.name))
              .toString();
            recursiveHelper();

            function recursiveHelper() {
              var regXArtifacts = RegExp(/artifacts.require\(["']/g);
              if (regXArtifacts.exec(fileString) === null) {
                return contractsArr;
              }
              fileString = fileString.slice(regXArtifacts.lastIndex);
              var i = 0;
              var newArtifact = "";

              while (fileString[i] !== '"' && fileString[i] !== "\'") {
                newArtifact = newArtifact + fileString[i];
                i++;
              }
              contractsArr.push(newArtifact);
              recursiveHelper();
            }
            prependFile.sync(
              path.join(root, fileStats.name),
              `var gasTestingHiddenContracts = []\n`
            );
            addGasStatsHelper();

            function addGasStatsHelper() {
              var improvedFile = fs
                .readFileSync(path.join(root, fileStats.name))
                .toString();
              const gasHooks =
                `\ngasTestingHiddenContracts = [${contractsArr}];` +
                '\nbefore(gasTestingHiddenStats.createGasStatCollectorBeforeHook(gasTestingHiddenContracts));\nafter(gasTestingHiddenStats.createGasStatCollectorAfterHook(gasTestingHiddenContracts));\n';
              let regXArtifacts = RegExp(/contract\(/g);
              let result;
              let indexes = [];
              while ((result = regXArtifacts.exec(improvedFile))) {
                // iterate over the values in the file starting at result, until you hit a {, keeping track of the index
                let insertionPoint = result.index;
                while (improvedFile[insertionPoint] !== "{") {
                  insertionPoint++;
                }

                var fileToWrite = fs.readFileSync(
                  path.join(root, fileStats.name)
                );
                let file_content = fileToWrite.toString();
                file_content = file_content.substring(insertionPoint + 1);
                var file = fs.openSync(path.join(root, fileStats.name), "a+");
                var bufferedText = new Buffer(gasHooks + file_content);
                fs.writeSync(
                  file,
                  bufferedText,
                  0,
                  bufferedText.length,
                  insertionPoint + 3
                );
                fs.closeSync(file);
                improvedFile = fs
                  .readFileSync(path.join(root, fileStats.name))
                  .toString();
              }
            }
          }

          next();
        }
      }
    };
    walk.walkSync(gasTestDirectory, options);
  }
};

module.exports = {
  generateGasTests, 
  deleteFolderRecursive,
  gasTestDirectory
};
