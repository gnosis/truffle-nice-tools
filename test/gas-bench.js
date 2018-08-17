const path = require('path')
const { assert } = require('chai')
const { withFixture, assertSpawnSync, assertFailingSpawnSync } = require('./utils')

const newEnv = Object.assign({}, process.env);
newEnv.GNOSIS_TNT_DEV_PATH = path.join(__dirname, '..');

describe('gas benchmarking tools', function () {
  it('should run the test suite', function () {
    withFixture('basic-truffle-project', (dir) => {
      assertSpawnSync('tnt', ['measureGas', '-f', 'inheritance-map.json'], { cwd: dir, env: newEnv })
    })
  })
})
