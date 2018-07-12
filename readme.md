## Truffle-nice-tools
A very simple, yet *nice* CLI interface toolkit for  [Truffle Framework](https://truffleframework.com/) development.

(Note: this toolkit uses the excellent new NPX feature of NPM to save you from a useless global install. Don't be shy. The format is npx <command>)

### Install
Run `npm i -D truffle-nice-tools` inside your [Truffle Framework](https://truffleframework.com/) project.

### Commands

##### Generic
npx tnt help, npx tnt -h..................Opens the help menu.
npx tnt version, npx tnt -v...............Check the version.

##### Network Extraction / Injection
npx tnt extractNetworks, npx tnt eN.......Extracts relevant network data from your build/contracts repository. Storing it in networks.json.
npx tnt injectNetworks, npx tnt iN........Injects the stored data from the networks.json file into the build/contracts ABI files via merge (it will overwrite conflicts, be warned)

