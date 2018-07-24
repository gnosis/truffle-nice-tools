const assert = require('assert')
const { spawnSync } = require('child_process')

const { withFixture } = require('./utils')

describe('network tools', function () {
  it('should extract network info from build artifacts', function () {
    withFixture('basic-truffle-project', (dir) => {
      const procRes = spawnSync('tnt', { cwd: dir })
      assert.fail(procRes.stdout.toString())
    })
  })
})
