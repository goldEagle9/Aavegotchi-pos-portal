/* global ethers run */

const { ethers } = require('hardhat')

const checkpointManagerAddress = '0x86e4dc95c7fbdbf52e33d563bbdb00823894c287'
const stateSenderAddress = '0x28e4f3a7f651294b9564800b2d01f35189a5bfbe'
const childChainManagerAddress = '0x4fe23a33922BcC5e560fdd74A84cDDe4D2BdaaAC'
const rootTokenAddress = '0x028171bca77440897b824ca71d1c56cac55b68a3'
const childTokenBytecodeHash = '0xb1746eb04870e235a8fc718690604b2fe0b2d5bce6aa6cf61b342d7157b300ff'

async function main () {
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()

  const RootChainManager = await ethers.getContractFactory('ATokenRootChainManager')
  const rootChainManager = await RootChainManager.deploy()
  await rootChainManager.deployed()
  console.log('Deployed RootChainManager: ', rootChainManager.address)

  const RootChainManagerProxy = await ethers.getContractFactory('RootChainManagerProxy')
  let rootChainManagerProxy = await RootChainManagerProxy.deploy(rootChainManager.address)
  await rootChainManagerProxy.deployed()
  console.log('Deployed RootChainManagerProxy: ', rootChainManagerProxy.address)

  rootChainManagerProxy = await ethers.getContractAt('ATokenRootChainManager', rootChainManagerProxy.address)

  const tx = await rootChainManagerProxy.initialize(
    account,
    stateSenderAddress,
    checkpointManagerAddress,
    childChainManagerAddress,
    childTokenBytecodeHash
  )

  console.log('Initializing: ', tx.hash)
  const receipt = await tx.wait()

  if (receipt.status) {
    console.log('RootChainManager initialized successfully')
  } else {
    console.log('RootChainManager initialized faileddddddddddddddddddddd')
    throw (Error('Contract transaction failed'))
  }

  // Deployed RootChainManager:  0x4db0319a402809a2c81051AB1549acF15809D1b3
  // Deployed RootChainManagerProxy:  0x0D29aDA4c818A9f089107201eaCc6300e56E0d5c

  /*
  tx = await rootChainManagerProxy.mapToken(rootTokenAddress)
  console.log('Mapping token: ', tx.hash)

  receipt = await tx.wait()

  if (receipt.status) {
    console.log('Mapping successful')
  } else {
    console.log('Mapping failed')
  }
  */

  // call mapping function man
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
