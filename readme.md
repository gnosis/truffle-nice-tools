## Truffle-nice-tools
A very simple, yet *nice* CLI interface toolkit for  [Truffle Framework](https://truffleframework.com/) development.

(Note: this toolkit uses the excellent new NPX feature of NPM to save you from a useless global install. Don't be shy. The format is npx <command>)

### Install
Run `npm i -D truffle-nice-tools` inside your [Truffle Framework](https://truffleframework.com/) project.

### Commands

##### Generic
```
npx tnt help, npx tnt -h..................Opens the help menu.
npx tnt version, npx tnt -v...............Check the version.
```
##### Network Extraction / Injection
```
npx tnt extractNetworks, npx tnt eN.......Extracts relevant network data from your build/contracts repository. Storing it in networks.json.
npx tnt injectNetworks, npx tnt iN........Injects the stored data from the networks.json file into the build/contracts ABI files via merge (it will overwrite conflicts, be warned)
```

##### Gas Testing Accurately
The Gas Testing module is created to give you more accurate `gas cost` representation stats, through injecting gas collection stats into your tests and outputting the data. Allowing you to accurately appropriate gas costs for your functions (note: you will want to include a little bit over the `max amount` to account)

1. Require the Gas Testing module from TNT suite.
...`const gasTest = require('truffle-nice-tools').gasTest`

2. In your Truffle Test files, where you wish to include gas collection. Perform these two steps:
...* Create an array holding all the artifacts that you would like to include in the testing. 
* `const testThese = [artifact1, artifact2, artifact3, artifact4]`
...* Include these hooks in your tests (once per contract)
*`before(utils.createGasStatCollectorBeforeHook(contracts))`
*`after(utils.createGasStatCollectorAfterHook(contracts))`
