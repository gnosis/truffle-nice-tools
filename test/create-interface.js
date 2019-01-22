const { assert } = require('chai')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const { withFixture, assertSpawnSync, assertFailingSpawnSync } = require('./utils')

describe('Creating an interface from the ABI', function () {
    it('Should create a new interface file in the project under the basic contracts directory', async () => {
        withFixture('basic-truffle-project', (dir) => {
            const interfaceEnv = Object.assign({}, process.env);
            
            const spawnResult = assertSpawnSync('run-with-testrpc', ['truffle compile --all && tnt cI build/contracts/BasicThing.json -o contracts/'], {
                cwd: dir, 
                env: interfaceEnv
            });

            const logDir = assertSpawnSync('ls', ['contracts'], {
                cwd: dir,
                env: interfaceEnv
            });

            let output = logDir.stdout.toString();
            assert.match(output, /IBasicThing.sol/, "Outputs Match");

            const checkFile = assertSpawnSync('cat', ['contracts/IBasicThing.sol'], {
                cwd: dir,
                env: interfaceEnv
            });

            let outputFile = checkFile.stdout.toString();
            assert.match(outputFile, /interface/, "Interface keyword exists");
        })
    })
})