"use strict";
const fs = require("fs-extra");
const path = require("path");
const walk = require("walk");
const prependFile = require("prepend-file");

const testDirectory = process.env.TESTDIR || path.join(__dirname, "../../../../test/");
const gasTestDirectory = process.env.GASTESTDIR || path.join(__dirname, "../../../../.hiddenOilWell");

const generateGasTests = () => {
  if (!fs.existsSync(gasTestDirectory)) {
    fs.mkdirSync(gasTestDirectory);
    fs.copySync(testDirectory, gasTestDirectory);

    const walkerOptions = {
      listeners: {
        file: function(root, fileStats, next) {
          if (fileStats.name.match(/.js$/g)) {
            prependFile.sync(
              path.join(root, fileStats.name),
              'const _$gasTestingHiddenStats = require("@gnosis.pm/truffle-nice-tools").testGas;\n'
            );
            prependFile.sync(
              path.join(root, fileStats.name),
              `var _$gasTestingHiddenContracts = []\n`
            );

            let contractsArr = [];
            let fileString = fs
              .readFileSync(path.join(root, fileStats.name))
              .toString();
            
            scanForRequiredArtifacts();
            addGasBeforeAndAfterHooks();

            function scanForRequiredArtifacts() {
              let regXArtifacts = /\bartifacts\s*.\s*require\s*\(\s*["']([^"']*)/g;
              let captured;

              while((captured = regXArtifacts.exec(fileString)) !== null) {
                contractsArr.push(captured[1]);
              }
            }

            function addGasBeforeAndAfterHooks() {
              const gasHooks = `_$gasTestingHiddenContracts = [${contractsArr}]; before(_$gasTestingHiddenStats.createGasStatCollectorBeforeHook(_$gasTestingHiddenContracts));after(_$gasTestingHiddenStats.createGasStatCollectorAfterHook(_$gasTestingHiddenContracts));`;
              let targetFile = fs.readFileSync(path.join(root, fileStats.name))
              let improvedFile = targetFile.toString().replace(/\bcontract\s*\(.*?{/g, "$&" + gasHooks);
              
              fs.writeFileSync(path.join(root, fileStats.name), improvedFile);
            }
          }
          next();
        }
      }
    };

    walk.walkSync(gasTestDirectory, walkerOptions);
  }
};

module.exports = {
  generateGasTests, 
  gasTestDirectory
};
