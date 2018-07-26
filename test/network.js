const assert = require('assert')
const fs = require('fs-extra')
const path = require('path')
const { withFixture, assertedSpawnSync } = require('./utils')

describe('network tools', function () {
  it('should extract empty network info from build artifacts containing no network info', function () {
    withFixture('basic-truffle-project', (dir) => {
      assertedSpawnSync('truffle', ['compile'], { cwd: dir })
      assertedSpawnSync('tnt', ['eN'], { cwd: dir })
      const networksObj = fs.readJSONSync(path.join(dir, 'networks.json'))

      assert.deepStrictEqual(networksObj, {})
    })
  })
})
