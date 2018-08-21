const { assert } = require('chai');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const { withFixture, assertSpawnSync, assertFailingSpawnSync } = require('./utils');

describe('Decode transactions', function() {
  it('Should decode previous transactions on the chain', async () => {
    withFixture('basic-truffle-project', (dir) => {
        const decodeEnv = Object.assign({}, process.env);
        decodeEnv.ABIFOLDER = path.join(dir, 'build/contracts');

        console.log('FIXTURE CREATED FOR TEST:', path.join(dir, 'build/contracts'));
        
        const spawnResult = assertSpawnSync('run-with-testrpc', ['truffle migrate --network local && tnt decodeTransactions --contracts'], 
        {
            cwd: dir,
            env: decodeEnv,
        });
        
        console.log(spawnResult.stdout.toString());
    })        
  });  
})
