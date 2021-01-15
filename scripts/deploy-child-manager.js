/* global ethers */

async function main () {
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()
  const stateReceiver = '0x0000000000000000000000000000000000001001'

  const ChildChainManager = await ethers.getContractFactory('ATokenChildChainManager')
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

  // ChildChainManagerProxy: 0x14aB595377e4fccCa46062A9109FFAC7FA4d3F18
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
