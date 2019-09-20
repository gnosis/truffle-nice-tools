const { testGas } = require(process.env.GNOSIS_TNT_DEV_PATH)

const BasicThing = artifacts.require('BasicThing')

contract('BasicThing', function(accounts) {
  before(testGas.createGasStatCollectorBeforeHook([BasicThing]))
  before(testGas.createGasStatCollectorAfterHook([BasicThing]))

  it('checks the thing at the beginning', async () => {
    const basicThing = await BasicThing.deployed()
    assert(await basicThing.checkTheThing())
    const basicThingCopy = await BasicThing.at(basicThing.address)
    assert(await basicThingCopy.checkTheThing())
  })
})
