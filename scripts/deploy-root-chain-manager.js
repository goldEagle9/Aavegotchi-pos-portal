/* global ethers run */

const { ethers } = require('hardhat')

const checkpointManagerAddress = '0x86e4dc95c7fbdbf52e33d563bbdb00823894c287'
const stateSenderAddress = '0x28e4f3a7f651294b9564800b2d01f35189a5bfbe'
const childChainManagerAddress = '0x4fe23a33922BcC5e560fdd74A84cDDe4D2BdaaAC'
const rootTokenAddress = '0x028171bca77440897b824ca71d1c56cac55b68a3'
const childTokenBytecodeHash = '0xb1746eb04870e235a8fc718690604b2fe0b2d5bce6aa6cf61b342d7157b300ff'

async function main () {
  // const flatFiles = await run('flatten', {
  //   files: [
  //     'contracts/root/TokenPredicates/AERC20Predicate.sol',
  //     'contracts/root/TokenPredicates/ERC20PredicateProxy.sol'
  //   ]
  // })
  // console.log(flatFiles.length)
  // throw ('done')
  // const UChildERC20Proxy = await ethers.getContractFactory('MATokenUChildERC20Proxy')
  // const uChildERC20Proxy = await UChildERC20Proxy.deploy()
  // await uChildERC20Proxy.deployed()
  // console.log(ethers.utils.keccak256(UChildERC20Proxy.bytecode)) // 0xb1746eb04870e235a8fc718690604b2fe0b2d5bce6aa6cf61b342d7157b300ff
  // console.log(UChildERC20Proxy.bytecode)
  // 0x16ff4b0fcf796e2dfb415d0dea528582c7aed1c3436853a33a4281cbf9689350
  // 0x9b3cd6a953e38dff0e5b428ef8a2f7ae1890f14e5f639965b3e22d18962f769f
  //  0x4959ff3e96c30a2fb562999a1db557e0a712887558abb76edd8903562f0ee05b
  // 0xf683f687ddcdbe98495276612c57e897a80b836b82fa6a0c77a8a828cd69b98a
  // 0xf683f687ddcdbe98495276612c57e897a80b836b82fa6a0c77a8a828cd69b98a
  // 0x1d675e7e0ac927de118d62c0eb565083152b6a770735496c6027a0187afaf43f
  // 0x6a623b988233a47c799a9e3740528eda4e2cae607f7b6ff27ff664166b7bfcf7
  // throw ('done')

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

  let tx = await rootChainManagerProxy.initialize(
    account,
    stateSenderAddress,
    checkpointManagerAddress,
    childChainManagerAddress,
    childTokenBytecodeHash
  )

  console.log('Initializing: ', tx.hash)
  let receipt = await tx.wait()

  if (receipt.status) {
    console.log('RootChainManager initialized successfully')
  } else {
    console.log('RootChainManager initialized faileddddddddddddddddddddd')
    throw (Error('Contract transaction failed'))
  }

  tx = await rootChainManagerProxy.mapToken(rootTokenAddress)
  console.log('Mapping token: ', tx.hash)

  receipt = await tx.wait()

  if (receipt.status) {
    console.log('Mapping successful')
  } else {
    console.log('Mapping failed')
  }

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
