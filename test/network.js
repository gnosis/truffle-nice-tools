const { assert } = require('chai')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')
const { withFixture, assertSpawnSync } = require('./utils')

describe('network tools', function () {
  it('should extract empty network info from build artifacts containing no network info', function () {
    withFixture('basic-truffle-project', (dir) => {
      assertSpawnSync('truffle', ['compile'], { cwd: dir })
      assertSpawnSync('tnt', ['eN'], { cwd: dir })
      const networksObj = fs.readJSONSync(path.join(dir, 'networks.json'))

      assert.deepStrictEqual(networksObj, {})
    })
  })

  it('should extract network info from build artifacts', function () {
    withFixture('basic-truffle-project', (dir) => {
      assertSpawnSync('run-with-testrpc', ['-d', '-i', '123', 'truffle migrate'], { cwd: dir })
      assertSpawnSync('run-with-testrpc', ['-m', '莱 既 茶 忙 瓦 穷 轻 添 斤 焦 农 如 详 亡 扰', '-i', '999', 'truffle migrate'], { cwd: dir })
      assertSpawnSync('tnt', ['eN'], { cwd: dir })
      const networksObj = fs.readJSONSync(path.join(dir, 'networks.json'))

      assert.nestedPropertyVal(networksObj, 'Migrations.123.address', '0xe78a0f7e598cc8b0bb87894b0f60dd2a88d6a8ab')
      assert.nestedPropertyVal(networksObj, 'Migrations.999.address', '0xa3c98bf4d4a7ef073ad47ac4376ae03fb5239523')
      assert.nestedPropertyVal(networksObj, 'BasicThing.123.address', '0xcfeb869f69431e42cdb54a4f4f105c19c080a601')
      assert.nestedPropertyVal(networksObj, 'BasicThing.999.address', '0x037146f506c2e0a0b3d341d10a9adcc52d6a4d27')
    })
  })
})
