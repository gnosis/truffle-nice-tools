const { assert } = require('chai')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const { withFixture, assertSpawnSync, assertFailingSpawnSync } = require('./utils')

describe('Creating an interface from the ABI', function () {
    it('Should create a new interface file in the project under', async () => {
        withFixture('basic-truffle-project', (dir) => {
            const interfaceEnv = Object.assign({}, process.env);
            
            const spawnResult = assertSpawnSync('run-with-testrpc', ['truffle compile --all'], {
                cwd: dir, 
                env: interfaceEnv
            });

            let output = spawnResult.stdout.toString();
            console.log(output);
        })
    })
})