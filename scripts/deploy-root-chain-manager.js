/* global ethers run */

const checkpointManagerAddress = '0x86e4dc95c7fbdbf52e33d563bbdb00823894c287'
const stateSenderAddress = '0x28e4f3a7f651294b9564800b2d01f35189a5bfbe'
const childChainManagerAddress = '0x28e4f3a7f651294b9564800b2d01f35189a5bfbe'
let tokenType = ''
let predicateAddress = ''
const rootTokenAddress = '0x028171bca77440897b824ca71d1c56cac55b68a3'
const childTokenAddress = '0x93eA6ec350Ace7473f7694D43dEC2726a515E31A'

async function main () {
  // const flatFiles = await run('flatten', {
  //   files: [
  //     'contracts/root/TokenPredicates/AERC20Predicate.sol',
  //     'contracts/root/TokenPredicates/ERC20PredicateProxy.sol'
  //   ]
  // })
  // console.log(flatFiles.length)
  // throw ('done')
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()

  // ERC20Predicate stuff
  const ERC20Predicate = await ethers.getContractFactory('AERC20Predicate')
  const erc20Predicate = await ERC20Predicate.deploy()
  console.log('Deployed ERC20Predicate: ', erc20Predicate.address)
  const ERC20PredicateProxy = await ethers.getContractFactory('ERC20PredicateProxy')
  let erc20PredicateProxy = await ERC20PredicateProxy.deploy(erc20Predicate.address)
  await erc20PredicateProxy.deployed()
  console.log('Deployed ERC20PredicateProxy: ', erc20PredicateProxy.address)
  predicateAddress = erc20PredicateProxy.address
  erc20PredicateProxy = await ethers.getContractAt('AERC20Predicate', predicateAddress)
  let tx = await erc20PredicateProxy.initialize(account)
  let receipt = await tx.wait()
  if (receipt.status) {
    console.log('ERC20Predicate initialized successfully')
  } else {
    console.log('ERC20Predicate initialized faileddddddddddddddddddddd')
    throw (Error('Failed transaction'))
  }
  tokenType = predicateAddress.padEnd(66, '0')
  // -----------------------

  const RootChainManager = await ethers.getContractFactory('ATokenRootChainManager')
  const rootChainManager = await RootChainManager.deploy()
  await rootChainManager.deployed()
  console.log('Deployed RootChainManager: ', rootChainManager.address)

  const RootChainManagerProxy = await ethers.getContractFactory('RootChainManagerProxy')
  let rootChainManagerProxy = await RootChainManagerProxy.deploy(rootChainManager.address)
  await rootChainManagerProxy.deployed()
  console.log('Deployed RootChainManagerProxy: ', rootChainManagerProxy.address)

  rootChainManagerProxy = await ethers.getContractAt('ATokenRootChainManager', rootChainManagerProxy.address)

  tx = await rootChainManagerProxy.initialize(
    account,
    stateSenderAddress,
    checkpointManagerAddress,
    childChainManagerAddress,
    tokenType,
    predicateAddress
  )
  console.log('Initializing: ', tx.hash)
  receipt = await tx.wait()

  if (receipt.status) {
    console.log('RootChainManager initialized successfully')
  } else {
    console.log('RootChainManager initialized faileddddddddddddddddddddd')
    throw (Error('Contract transaction failed'))
  }

  tx = await rootChainManagerProxy.mapToken(rootTokenAddress, childTokenAddress, tokenType)
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
