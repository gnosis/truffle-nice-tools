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
        // console.log('FIXTURE CREATED FOR TEST:', path.join(dir, 'build/contracts'));
        
        const spawnResult = assertSpawnSync('run-with-testrpc', ['truffle migrate --network local && tnt decodeTransactions --contracts'], 
        {
            cwd: dir,
            env: decodeEnv,
        });

        let output = spawnResult.stdout.toString();
        let found = output.match(/~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/);
        let foundBasicThing = output.match(/BasicThing/);
        assert.notEqual(found, null);
        assert.equal(foundBasicThing[0], 'BasicThing');
      
    })        
  });  

  it('Should appropriately show when there are no previous transactions and contracts', async () => {
    withFixture('basic-truffle-project', (dir) => {
        const decodeEnv = Object.assign({}, process.env);
        decodeEnv.ABIFOLDER = path.join(dir, 'build/contracts');
        // console.log('FIXTURE CREATED FOR TEST:', path.join(dir, 'build/contracts'));
        const spawnResult = assertSpawnSync('run-with-testrpc', ['truffle compile && tnt decodeTransactions --contracts'], 
        {
            cwd: dir,
            env: decodeEnv,
        });

        let output = spawnResult.stdout.toString();
        let transactions = output.match(/There are no transactions to show/);
        assert.equal(transactions[0], 'There are no transactions to show');
    })        
  });  
})
