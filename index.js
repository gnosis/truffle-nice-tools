#!/usr/bin/env node
const fs = require('fs');
const path = require("path");
const _ = require("lodash");

const minimist = require("minimist");
const chalk = require("chalk");
const { log } = console;

// module export an object that includes the two functions
const testGas = require('./gas/testGas.js');

module.exports = {
  testGas
};
