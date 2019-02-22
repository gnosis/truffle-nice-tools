#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const dir = path.join("build", "contracts");

module.exports = () => {
  try {
    const dirFiles = fs.readdirSync(dir);
    Promise.all(
      dirFiles.filter(fname => fname.endsWith(".json")).map(
        fname =>
          new Promise((resolve, _reject) => {
            fs.readFile(path.join(dir, fname), (err, data) => {
              if (err) throw err;
              let fullTruffleBuild = JSON.parse(data)
              delete fullTruffleBuild.ast
              delete fullTruffleBuild.legacyAST
              delete fullTruffleBuild.sourcePath
              resolve( {fileName: fname, buildFile: fullTruffleBuild});
            });
          })
      )
    ).then( results => {
        results.map( ({fileName, buildFile}) => {
            fs.writeFileSync(
                path.join(dir, fileName),
                JSON.stringify(buildFile)
            );
        })
    });
  } catch (err) {
    if (err.code === "ENOENT") {
      spinner.stop();
    } else {
      throw err;
    }
  }
};
