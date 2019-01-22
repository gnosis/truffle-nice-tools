#!/usr/bin/env node
// Credits: @rangelife
var fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { log } = console;

const createInterface = (args) => {
  const outputFolder = args.o || path.resolve(__dirname, '../../../../contracts');

  try {
	var contractName = JSON.parse(fs.readFileSync(process.argv[3])).contractName;
    var abi = JSON.parse(fs.readFileSync(process.argv[3])).abi;
  } catch (e) {
	log('arg1', process.argv[1], 'arg2', process.argv[2], 'arg3', process.argv[3])
    dieUsage();
  }

  if (!contractName) dieUsage();

  var toDump = '';
  function dump(x) {
    toDump += x;
  }

  dump('interface ' + contractName);
  dump('{\n');

  var i = 0;
  for (i = 0; i < abi.length; i++) {
    var entity = abi[i];
    if (!Array.isArray(entity.inputs)) {
      die("entity inputs isn't an array in " + JSON.stringify(entity));
    }
    switch (entity.type) {
      case 'constructor':
        dumpConstructor(entity);
        break;
      case 'function':
        dumpFunction(entity);
        break;
      case 'event':
        // these don't go in the interface file
        break;
      default:
        die('Unknown entity type ' + entity.type + ' in ABI.');
    }
  }

  dump('}');

  log(toDump);

  if (!fs.existsSync(outputFolder)) {
	try {
	 fs.mkdirSync(outputFolder);
	  fs.writeFileSync(`${outputFolder}/I${contractName}.sol`, toDump);
	} catch(e) {
		log('Error: ', e);
	}
  } else {
	try {
		fs.writeFileSync(`${outputFolder}/I${contractName}.sol`, toDump);
	} catch(e) {
		log('Error', e);
	}
  }
  
  // Helper Functions

  function die(x) {
    console.error(chalk.red(x));
    process.exit(1);
  }

  function dieUsage() {
    die('Invalid Usage. Make sure you specify the correct .json ABI file. (Example: npx tnt cI build/contracts/abi.json)');
  }

  function dumpConstructor(entity) {
    dump('function ' + contractName + '(');
    dumpArgs(entity.inputs);
    dump(');\n');
  }

  function dumpFunction(entity) {
    dump('function ' + entity.name + '(');
    dumpArgs(entity.inputs);
    dump(') ');
    if (entity.constant) {
      dump('constant ');
    }
    if (entity.outputs.length) {
      dump('returns (');
      dumpArgs(entity.outputs);
      dump(')');
    }
    dump(';\n');
  }

  function dumpArgs(args) {
    var i;
    for (i = 0; i < args.length; i++) {
      var arg = args[i];
      if (i) dump(',');
      dump(arg.type + ' ' + arg.name);
    }
  }
};

module.exports = createInterface;
