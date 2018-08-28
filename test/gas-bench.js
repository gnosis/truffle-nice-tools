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
      newEnv.GASTESTDIR = path.join(fixtureDir, 'gasTests');
      newEnv.GASTESTTESTINGDIRECTORY = 'truffle test ' + path.join(fixtureDir, 'gasTests/**');
      newEnv.BUILDGASFILE = path.join(fixtureDir, 'build/gas/gas-stats.json');
      newEnv.GAS_STATS_FILE = path.join(fixtureDir, 'build/gas/gas-stats.json');
      this.timeout(50000);
      const sync = assertSpawnSync('tnt', ['measureGas', '-f', 'inheritance-map.json'], { cwd: fixtureDir, env: newEnv, stdout: 'pipe' });
      console.log('SYNC:', sync);
    })
  });

  it('Should not fail upon no inheritance map.', function () {
    withFixture('basic-truffle-project', (fixtureDir) => {
      newEnv.TESTDIR = path.join(fixtureDir, 'test');
      newEnv.GASTESTDIR = path.join(fixtureDir, 'gasTests');
      newEnv.GASTESTTESTINGDIRECTORY = 'truffle test ' + path.join(fixtureDir, 'gasTests/**');
      newEnv.BUILDGASFILE = path.join(fixtureDir, 'build/gas/gas-stats.json');
      newEnv.GAS_STATS_FILE = path.join(fixtureDir, 'build/gas/gas-stats.json');
      this.timeout(50000);
      const sync = assertSpawnSync('tnt', ['mG'], { cwd: fixtureDir, env: newEnv, stdout: 'pipe' })
      console.log('sync2', sync);
      // console.log('SYNCOUTPUT: ', sync.output);
      // assert.equal(syncOutput.substr(0,3), '-- ');
    })
  });

  it('Should automatically create a clone of the tests folder and prepend the require statement to it', function () {

  });
});

