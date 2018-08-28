const { assert } = require('chai')
const path = require('path')
const fs = require('fs-extra')
const tmp = require('tmp')
const { spawnSync } = require('child_process')

exports.withFixture = function withFixture(fixtureName, callback) {
  const tmpDir = tmp.dirSync({ unsafeCleanup: true })

  let err
  try {
    fs.copySync(path.join(__dirname, 'fixtures', fixtureName), tmpDir.name)
    callback(tmpDir.name)
  } catch(e) {
    err = e
  } finally {
    tmpDir.removeCallback()
  }
  if(err) throw err
}

exports.assertSpawnSync = function assertSpawnSync() {
  const procRes = spawnSync(...arguments)
  assert.equal(procRes.status, 0, `spawnSync(...${
    JSON.stringify(arguments, null, 2)
  }) failed with output status ${procRes.status}, stdout:\n\n${
    procRes.stdout.toString()
  }\n\nand stderr:\n\n${
    procRes.stderr.toString()
  }`)
  return procRes;
}

exports.assertFailingSpawnSync = function assertFailingSpawnSync() {
  const procRes = spawnSync(...arguments)

  assert.notEqual(procRes.status, 0, `spawnSync(...${
    JSON.stringify(arguments, null, 2)
  }) succeeded with stdout:\n\n${
    procRes.stdout.toString()
  }\n\nand stderr:\n\n${
    procRes.stderr.toString()
  }`)
  return procRes;
}
