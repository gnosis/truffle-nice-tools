const path = require('path')
const fs = require('fs-extra')
const tmp = require('tmp')

function withFixture(fixtureName, callback) {
  const tmpDir = tmp.dirSync({ unsafeCleanup: true })
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

Object.assign(exports, { withFixture })