const menus = {
    main: `
    tnt [command] <options>

    injectNetworks, iN..........inject the networks.json file into your artifacts
    extractNetworks, eN.........extract the real network data from artifacts into networks.json
    measureGas, mG..............creates gas benchmarks from your test cases, outputs to the console and writes a JSON file.

    version, -v.............show current version
    help, -h................show help menu for a command
    `,

    injectNetworks: `
        tnt injectNetwork <options> 

        --path, -p specify a custom directory to the truffle artifacts folder
    `,

    extractNetworks:`
        tnt extractNetworks <options>

        --path, -p specify a custom directory to the truffle artifacts folder
    `,

    measureGas:`
        tnt measureGas <options> 
        
        -f specify a .JSON file to import a topologically sorted mapping of your contracts for benchmarking. 
    `
}

module.exports = (args) => {
    const subcommand = args._[0] === 'help' ? args._[1] : args._[0];
    console.log('subcommand', subcommand)        

    console.log(menus[subcommand] || menus.main);
}