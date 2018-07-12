const menus = {
    main: `
    tnt [command] <options>

    injectNetwork..........inject the networks.json file into your artifacts
    extractNetwork.........extract the real network data from artifacts into networks.json

    version................show current version
    help...................show help menu for a command
    `,

    injectNetwork: `
        tnt injectNetwork <options>

        --path, -p specify a custom directory to the truffle artifacts folder
    `,

    extractNetworks:`
        tnt extractNetworks <options>

        --path, -p specify a custom directory to the truffle artifacts folder
    `,
}

module.exports = (args) => {
    const subcommand = args._[0] === 'help' ? args._[1] : args._[0];
    console.log('subcommand', subcommand)        

    console.log(menus[subcommand] || menus.main);
}