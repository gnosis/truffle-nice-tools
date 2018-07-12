const chalk = require('chalk');
const { version } = require('../package.json');
const { log } = console;

module.exports = () => {
    log(chalk.cyan(`truffle-nice-tools version: ${version}`));
}