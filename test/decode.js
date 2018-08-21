const { assert } = require('chai');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const { withFixture, assertSpawnSync, assertFailingSpawnSync } = require('./utils');

describe('Decode transactions', function() {
  it('Should decode previous transactions on the chain', async () => {
    withFixture('basic-truffle-project', (dir) => {

        console.log('FIXTURE CREATED FOR TEST:', path.join(dir, 'build/contracts'));
        // compile a build in the temp directory
        assertSpawnSync('truffle', ['compile'], {cwd: dir});

        // fs.readdir(dir + '/build', (err, res) => {
        //     if (err) { console.log(err) } 
        //     console.log(res);
        // })
        // assertSpawnSync('ganache-cli', ['--port 7545', '-d']);
        assertSpawnSync('truffle', ['migrate --network development'], {cwd: dir});
        // migrate the projects to a network
        // 
        assertSpawnSync(`ABIFOLDER=${dir} tnt`, ['decodeTransactions'], {cwd: dir});
    })        
  });  
})