## Truffle-nice-tools
A very simple, yet *nice* CLI interface toolkit for  [Truffle Framework](https://truffleframework.com/) development.

(Note: this toolkit uses the excellent new NPX feature of NPM to save you from a useless global install. Don't be shy. The format is npx \<command>)

### Install
Run `npm i -D @gnosis.pm/truffle-nice-tools` inside your [Truffle Framework](https://truffleframework.com/) project.

---
Commands
-----

##### Generic
```
npx tnt help <command>, npx tnt -h........Opens the help menu. 
```
Find all the options and flags availabble in individual commands by running npx tnt help <commandname>. 
```
npx tnt version, npx tnt -v...............Check the version.
```
---
##### Create Interface (from ABI)
```
npx tnt createInterface, cI <path to ABI> <options>....Creates a Solidity interface contract for the selected .json ABI.
```

##### Decoding
```
npx tnt decodeTransactions, npx tnt dT <options>....Decodes the transactions which have occured on your network of choice.  
```
* In order to decode transactions, you will need to have an Ethereum network running, we check for port 8545 by default but if you would like to connect to a network at a different port, please simply update your process.env.CHAINPORT environment variable to the port of your Ethereum network.

* By default, it is assumed your .json ABI files are located at `/build/contracts`. If you would like to change your ABI folder, please simply change the process.env.ABIFOLDER environment variable. 

##### Network Extraction / Injection
```
npx tnt extractNetworks, npx tnt eN <options>.......Extracts relevant network data from your build/contracts repository. Storing it in networks.json.
npx tnt injectNetworks, npx tnt iN <options>........Injects the stored data from the networks.json file into the build/contracts ABI files via merge (it will overwrite conflicts, be warned)
```

##### Truffle build cleaning (reduce file size)
There are some parameters in truffle files like ast, legacyAST that are used by debuggers, usually you don't need that. 
Also the sourcePath it's something personal, might be better to remove it from the public build.
```
npx tnt cleanBuild
```

##### Gas Benchmarking
The Gas Benchmarking module is created to give you more accurate `gas cost` representation stats, through injecting gas collection stats into your tests and outputting the data. 

  * ( The first index holds the contract for gas measurements, the second index holds its inheritance tree. This list should be topologically sorted for maximum benchmarking efficiency. )
1. Execute this command:

```
npx tnt measureGas, npx tnt mG <options>..........This will generate benchmarks for your function gas usage, derived from your test cases. The stats are stored at `build/gas/gas-stats.json` by default, but may be modified with the `-o` option:
``` 

* (Optional) Create a JSON file holding a mapping (preferably topologically sorted) of your contract heirarchy you want benchmarked in the format shown below:
```
npx tnt measureGas -f <path to .json mapping file> -o <path to your desired gas-stats location>
```

###### Example Inheritance Map
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

*(Pro-Tip: If you are having errors with compiling, npx will attempt to use the local Truffle install, make sure your compiler versions are the same, if you are normally using a global Truffle install. )*

> Special thanks to Alan Lu (@cag), Dominik Teiml (@dteiml), and @rangelife for contributing the tools and ideas for this tool kit. 

###### Testing
To run the test suite, make sure that the truffle-nice-tools package is npm linked by running `npm link` from inside the folder, then proceed to execute the `npm run test` command. 