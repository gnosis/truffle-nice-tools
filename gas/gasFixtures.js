const fs = require('fs-extra');
const path = require('path');
const walk = require('walk');
const prependFile = require('prepend-file');
// make temporary for tests directory
// iterate recursively over the test directorry looking for .js files
// copy them into the new test directory
// remove directory
const testDirectory = path.join(__dirname, '../../../../test/');
const gasTestDirectory = path.join(__dirname, '../../../../gasTests');

var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
};



if (!fs.existsSync(gasTestDirectory)) {
    fs.mkdirSync(gasTestDirectory);
    fs.copySync(testDirectory, gasTestDirectory);

    walker = walk.walk(gasTestDirectory);

    walker.on('file', (root, fileStats, next) => {
        if (fileStats.name.match(/.js$/ig)) {
            console.log(root);
            prependFile(path.join(root, fileStats.name), 'const testGas = require("@gnosis.pm/truffle-nice-tools").testGas;\n', (err, res) => {
                if (err) { console.log(err) }

            })
        }
        next();
    })

    // deleteFolderRecursive(gasTestDirectory);
} else {
    deleteFolderRecursive(gasTestDirectory);
}

