/* global ethers */

async function main () {
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()

  const RootChainManager = await ethers.getContractFactory('ATokenRootChainManager')
  const rootChainManager = await RootChainManager.deploy()
  await rootChainManager.deployed()
  let tx = rootChainManager.deployTransaction
  let receipt = await tx.wait()
  if (receipt.status) {
    console.log('RootChainManager deployed successfully:', rootChainManager.address)
  } else {
    console.log('RootChainManager deploy faileddddddddddddddddddddd')
  }

  const rootChainManagerProxy = await ethers.getContractAt('RootChainManagerProxy', '0x0D29aDA4c818A9f089107201eaCc6300e56E0d5c')
  tx = await rootChainManagerProxy.updateImplementation(rootChainManager.address)
  console.log('Setting new implementation: ', tx.hash)
  receipt = await tx.wait()
  if (receipt.status) {
    console.log('RootChainManager implementation updated successfully')
  } else {
    console.log('RootChainManager implementation update faileddddddddddddddddddddd')
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
