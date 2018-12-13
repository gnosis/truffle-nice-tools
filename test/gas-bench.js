const path = require('path')
const { assert } = require('chai')
const { withFixture, assertSpawnSync, assertFailingSpawnSync } = require('./utils')

const newEnv = Object.assign({}, process.env);
newEnv.GNOSIS_TNT_DEV_PATH = path.join(__dirname, '..');
newEnv.GASTESTTESTINGDIRECTORY;

describe('gas benchmarking tools', function () {
  it('should run the test suite', function () {
    withFixture('basic-truffle-project', (fixtureDir) => {
      newEnv.TESTDIR = path.join(fixtureDir, 'test');
      newEnv.GASTESTDIR = path.join(fixtureDir, '.hiddenOilWell');
      newEnv.GASTESTTESTINGDIRECTORY = 'truffle test ' + path.join(fixtureDir, '.hiddenOilWell/**');
      newEnv.BUILDGASFILE = path.join(fixtureDir, 'build/gas/gas-stats.json');
      newEnv.GAS_STATS_FILE = path.join(fixtureDir, 'build/gas/gas-stats.json');
      
      this.timeout(50000);
      const sync = assertSpawnSync('tnt', ['measureGas', '-f', 'inheritance-map.json'], { cwd: fixtureDir, env: newEnv, stdout: 'pipe' });
    })
  });

  it('Should not fail upon no inheritance map.', function () {
    withFixture('basic-truffle-project', (fixtureDir) => {
      newEnv.TESTDIR = path.join(fixtureDir, 'test');
      newEnv.GASTESTDIR = path.join(fixtureDir, '.hiddenOilWell');
      newEnv.GASTESTTESTINGDIRECTORY = 'truffle test ' + path.join(fixtureDir, '.hiddenOilWell/**');
      newEnv.BUILDGASFILE = path.join(fixtureDir, 'build/gas/gas-stats.json');
      newEnv.GAS_STATS_FILE = path.join(fixtureDir, 'build/gas/gas-stats.json');
      
      this.timeout(50000);
      const sync = assertSpawnSync('tnt', ['mG'], { cwd: fixtureDir, env: newEnv, stdout: 'pipe' })
      const output = sync.output.toString();
      // console.log('Output\n', output);
      let foundRightOutput = output.match(/-- Gas stats --/);
      assert.notEqual(foundRightOutput, null);
      let foundAvgKeyword = output.match(/avg/);
      assert.equal(foundAvgKeyword[0], 'avg');
    })
  });
});

