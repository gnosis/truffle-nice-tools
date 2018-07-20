## Truffle-nice-tools
A very simple, yet *nice* CLI interface toolkit for  [Truffle Framework](https://truffleframework.com/) development.

(Note: this toolkit uses the excellent new NPX feature of NPM to save you from a useless global install. Don't be shy. The format is npx <command>)

### Install
Run `npm i -D @gnosis.pm/truffle-nice-tools` inside your [Truffle Framework](https://truffleframework.com/) project.

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

##### Gas Benchmarking
The Gas Benchmarking module is created to give you more accurate `gas cost` representation stats, through injecting gas collection stats into your tests and outputting the data. 

1. Require the Gas Testing module from TNT suite.
...`const gasTest = require('@gnosis.pm/truffle-nice-tools').gasTest`

2. In your Truffle Test files, where you wish to include gas collection. Perform these two steps:
 + Create an array holding all the artifacts that you would like to include in the testing. 
     * `const testThese = [artifact1, artifact2, artifact3, artifact4]`
  + Include these hooks in your tests (once per contract)
     * `before(gasTest.createGasStatCollectorBeforeHook(testThese))`
     * `after(gasTest.createGasStatCollectorAfterHook(testThese))`
3. Create a JSON file holding a mapping (preferably topologically sorted) of your contract heirarchy you want benchmarked in the format shown below:
```
{
    "Event": ["CategoricalEvent", "ScalarEvent"],
    "StandardMarket": ["StandardMarketWithPriceLogger"],
    "Market": ["StandardMarket"],
    "MarketMaker": ["LMSRMarketMaker"],
    "Oracle": [
        "CentralizedOracle",
        "DifficultyOracle",
        "FutarchyOracle",
        "MajorityOracle",
        "SignedMessageOracle",
        "UltimateOracle"
      ],
    "StandardToken": ["EtherToken", "OutcomeToken"],
    "Token": ["StandardToken"]
}
```
  * ( The first index holds the contract for gas measurements, the second index holds its inheritance tree. This list should be topologically sorted for maximum benchmarking efficiency. )
4. Execute this command:
```
npx tnt measureGas -f <path to .json mapping file>
``` 

This will generate benchmarks for your function gas usage, derived from your test cases. The stats are stored at `build/gas/gas-stats.json` by default, but may be modified with the `-o` option:

```
npx tnt measureGas -f <path to .json mapping file> -o <path to your desired gas-stats location>
```

*(Pro-Tip: If you are having errors with compiling, npx will attempt to use the local Truffle install, make sure your compiler versions are the same, if you are normally using a global Truffle install. )*