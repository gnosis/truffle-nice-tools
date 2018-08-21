const { assert } = require('chai');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const { withFixture, assertSpawnSync, assertFailingSpawnSync } = require('./utils');

describe('Decode transactions', function() {
  it.skip('Should decode previous transactions on the chain', async () => {
    withFixture('basic-truffle-project', (dir) => {
        const decodeEnv = Object.assign({}, process.env);
        decodeEnv.ABIFOLDER = path.join(dir, 'build/contracts');

        console.log('FIXTURE CREATED FOR TEST:', path.join(dir, 'build/contracts'));

        assertSpawnSync('truffle', ['compile'], {cwd: dir});

        assertSpawnSync('run-with-testrpc', ['-d', '-i', '123', 'truffle migrate --network local --reset'], { cwd: dir })
        assertSpawnSync('run-with-testrpc', ['-m', '莱 既 茶 忙 瓦 穷 轻 添 斤 焦 农 如 详 亡 扰', '-i', '999', 'truffle migrate --network local --reset'], { cwd: dir })
        
        assertSpawnSync('tnt', ['decodeTransactions'], 
        {
            cwd: dir,
            env: decodeEnv,
            stdio: 'pipe',
            encoding: 'utf-8'
        });
        
    })        
  });  
})