const menus = {
    main: `
    tnt [command] <options>

    injectNetworks, iN..........inject the networks.json file into your artifacts
    extractNetworks, eN.........extract the real network data from artifacts into networks.json
    decodeTransactions, dT......decodes the transactions which have occured on your network of choice, listing them in the console.
    measureGas, mG..............creates gas benchmarks from your test cases, outputs to the console and writes a JSON file.

    version, -v.............show current version
    help, -h................show help menu for a command
    `,

    injectNetworks: `
        tnt injectNetwork, tnt iN <options> 

        --path, -p specify a custom directory to the truffle artifacts folder
    `,

    extractNetworks:`
        tnt extractNetworks, tnt eN <options>

        --path, -p specify a custom directory to the truffle artifacts folder
    `,

    decodeTransactions:`
        tnt decodeTransactions, tnt dT <options>

        -s, specify the starting block at which to start decoding transactions on your network (defaults to the initial block).
        -b, specify the specific block at which to decode transactions on your network.
        -e, specify the ending block at which to end decoding transactions on your network (defaults to the last block on the network.
        --contracts, list all contracts in your build folder and their deployed addresses.
    `,

    measureGas:`
        tnt measureGas, tnt mG <options> 
        
        -f specify a .JSON file to import a topologically sorted mapping of your contracts for benchmarking. 
    `
}

module.exports = (args) => {
    const subcommand = args._[0] === 'help' ? args._[1] : args._[0];
    // console.log('subcommand', subcommand)        

    console.log(menus[subcommand] || menus.main);
}