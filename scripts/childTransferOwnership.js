/* global ethers */

async function main () {
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()
  const multiSigAddress = '0x258cC4C495Aef8D809944aD94C6722ef41216ef3'

  const childChainManager = await ethers.getContractAt('ATokenChildChainManager', '0x4fe23a33922BcC5e560fdd74A84cDDe4D2BdaaAC')
  const childChainManager = await ChildChainManager.deploy()
  await childChainManager.deployed()
  console.log('Deployed ChildChainManager: ', childChainManager.address)

  const ChildChainManagerProxy = await ethers.getContractFactory('ChildChainManagerProxy')
  let childChainManagerProxy = await ChildChainManagerProxy.deploy(childChainManager.address)
  await childChainManagerProxy.deployed()
  console.log('Deployed ChildChainManagerProxy: ', childChainManagerProxy.address)

  childChainManagerProxy = await ethers.getContractAt('ATokenChildChainManager', childChainManagerProxy.address)
  // UChildERC20:  0xDf36944e720cf5Af30a3C5D80d36db5FB71dDE40
  const erc20Implementation = '0xDf36944e720cf5Af30a3C5D80d36db5FB71dDE40'
  const tx = await childChainManagerProxy.initialize(account, account, stateReceiver, erc20Implementation)
  console.log('Initializing: ', tx.hash)
  const receipt = await tx.wait()

  if (receipt.status) {
    console.log('ChildChainManager initialized successfully')
  } else {
    console.log('ChildChainManager initialized faileddddddddddddddddddddd')
  }

  const childTokenBytecodeHash = await childChainManagerProxy.childTokenBytecodeHash()
  console.log('childTokenBytecodeHash:', childTokenBytecodeHash)

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
