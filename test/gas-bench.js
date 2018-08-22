const path = require('path')
const { assert } = require('chai')
const { withFixture, assertSpawnSync, assertFailingSpawnSync } = require('./utils')

const newEnv = Object.assign({}, process.env);
newEnv.GNOSIS_TNT_DEV_PATH = path.join(__dirname, '..');

describe('gas benchmarking tools', function () {
  it('should run the test suite', function () {
    withFixture('basic-truffle-project', (dir) => {
      this.timeout(8000);
      const sync = assertSpawnSync('tnt', ['measureGas', '-f', 'inheritance-map.json'], { cwd: dir, env: newEnv, stdout: 'pipe' });
      // console.log('SYNCOUTPUT111', sync.output.toString());
    })
  });

  it('Should not fail upon no inheritance map.', function () {
    withFixture('basic-truffle-project', (dir) => {
      this.timeout(8000);
      const sync = assertSpawnSync('tnt', ['mG'], { cwd: dir, env: newEnv, stdout: 'pipe' })
      // const syncOutput = sync.output.toString();
      // console.log('SYNCOUTPUT: ', sync.output);
      // assert.equal(syncOutput.substr(0,3), '-- ');
    })
  });

  it('Should automatically create a clone of the tests folder and prepend the require statement to it', function () {

  });
})
