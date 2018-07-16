// user imports map
const fs = require("fs");

module.exports = args => {
  let importFile = JSON.parse(fs.readFileSync(args.f, "utf8"));
  let inheritanceMap = [];
  for (var key in importFile) {
    inheritanceMap.push([key, importFile[key]]);
    // console.log("key", key, "value", inheritanceMap[key]);
  }
  return inheritanceMap;
};
