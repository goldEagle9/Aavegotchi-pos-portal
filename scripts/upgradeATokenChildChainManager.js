/* global ethers */

async function main () {
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()

  const ChildChainManager = await ethers.getContractFactory('ATokenChildChainManager')
  const childChainManager = await ChildChainManager.deploy()
  await childChainManager.deployed()
  let tx = childChainManager.deployTransaction
  let receipt = await tx.wait()
  if (receipt.status) {
    console.log('ChildChainManager deployed successfully:', childChainManager.address)
  } else {
    console.log('ChildChainManager deploy faileddddddddddddddddddddd')
  }

  const childChainManagerProxy = await ethers.getContractAt('ChildChainManagerProxy', '0x4fe23a33922BcC5e560fdd74A84cDDe4D2BdaaAC')
  tx = await childChainManagerProxy.updateImplementation(childChainManager.address)
  console.log('Setting new implementation: ', tx.hash)
  receipt = await tx.wait()
  if (receipt.status) {
    console.log('ChildChainManager implementation updated successfully')
  } else {
    console.log('ChildChainManager implementation update faileddddddddddddddddddddd')
  }

  // ChildChainManagerProxy: 0x4fe23a33922BcC5e560fdd74A84cDDe4D2BdaaAC
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
