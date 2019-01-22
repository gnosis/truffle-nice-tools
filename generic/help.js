const menus = {
    main: `
    tnt [command] <options>

    injectNetworks, iN <options>..........inject the networks.json file into your artifacts
    extractNetworks, eN <options>.........extract the real network data from artifacts into networks.json
    decodeTransactions, dT <options>......decodes the transactions which have occured on your network of choice, listing them in the console.
    measureGas, mG <options>..............creates gas benchmarks from your test cases, outputs to the console and writes a JSON file.
    createInterface, cI <path to ABI> <options>..creates a Solidity interface contract for the selected .json ABI.

    version, -v.............show current version
    help <command>, -h......show help menu for a command
    `,

    injectNetworks: `
        injectNetworks, iN <options>..........inject the networks.json file into your artifacts

        --path, -p specify a custom directory to the truffle artifacts folder
    `,
    iN: `
        injectNetworks, iN <options>..........inject the networks.json file into your artifacts

        --path, -p specify a custom directory to the truffle artifacts folder
    `,
    extractNetworks:`
        extractNetworks, eN <options>.........extract the real network data from artifacts into networks.json
    
        --path, -p specify a custom directory to the truffle artifacts folder
    `,
    eN:`
        extractNetworks, eN <options>.........extract the real network data from artifacts into networks.json

        --path, -p specify a custom directory to the truffle artifacts folder
    `,
    decodeTransactions:`
        decodeTransactions, dT <options>......decodes the transactions which have occured on your network of choice, listing them in the console.

        -s, specify the starting block at which to start decoding transactions on your network (defaults to the initial block).
        -b, specify the specific block at which to decode transactions on your network.
        -e, specify the ending block at which to end decoding transactions on your network (defaults to the last block on the network.
        --contracts, list all contracts in your build folder and their deployed addresses.
    `,
    dT:`
        decodeTransactions, dT <options>......decodes the transactions which have occured on your network of choice, listing them in the console.

        -s, specify the starting block at which to start decoding transactions on your network (defaults to the initial block).
        -b, specify the specific block at which to decode transactions on your network.
        -e, specify the ending block at which to end decoding transactions on your network (defaults to the last block on the network.
        --contracts, list all contracts in your build folder and their deployed addresses.
    `,
    measureGas:`
        measureGas, mG <options>..............creates gas benchmarks from your test cases, outputs to the console and writes a JSON file.
        
        -f, specify a .JSON file to import a topologically sorted mapping of your contracts for benchmarking. 
    `,
    mG:`
        measureGas, mG <options>..............creates gas benchmarks from your test cases, outputs to the console and writes a JSON file.
        
        -f, specify a .JSON file to import a topologically sorted mapping of your contracts for benchmarking. 
    `,
    createInterface:`
        createInterface, cI <path to ABI> <options>..creates a Solidity interface contract for the selected .json ABI.

        -o, specify an output directory path for the constructed interface.
    `,
    cI:`
        createInterface, cI <path to ABI> <options>..creates a Solidity interface contract for the selected .json ABI.
        
        -o, specify an output directory path for the constructed interface.
    `
}

module.exports = (args) => {
    const subcommand = args._[0] === 'help' ? args._[1] : args._[0];
    // console.log('subcommand', subcommand)        

    console.log(menus[subcommand] || menus.main);
}