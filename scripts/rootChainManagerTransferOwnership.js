/* global ethers */

const rootChainManagerAddress = '0x0D29aDA4c818A9f089107201eaCc6300e56E0d5c'

async function main () {
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()
  const newOwner = '0x14B76eBB2F4391D8b506d6c7e6ABAf5FcaBd26F8'
  const rootChainManager = await ethers.getContractAt('ATokenRootChainManager', rootChainManagerAddress)
  let tx = await rootChainManager.setMapper(newOwner)
  console.log('Setting mapper: ', tx)
  let receipt = await tx.wait()
  if (receipt.status) {
    console.log('Setting mapper success')
  } else {
    throw Error('Setting mapper fail')
  }

  tx = await rootChainManager.setOwner(newOwner)
  console.log('Setting owner: ', tx)
  receipt = await tx.wait()
  if (receipt.status) {
    console.log('Setting owner success')
  } else {
    throw Error('Setting owner fail')
  }

  const rootChainManagerProxy = await ethers.getContractAt('RootChainManagerProxy', rootChainManagerAddress)
  tx = await rootChainManagerProxy.transferProxyOwnership(newOwner)
  console.log('Setting proxy owner: ', tx)
  receipt = await tx.wait()
  if (receipt.status) {
    console.log('Setting proxy owner success')
  } else {
    throw Error('Setting proxy owner fail')
  }

  // const rootToken = await ethers.getContractAt('ChildERC20', rootTokenAddress)

  // console.log('Deposit transaction: ', tx.hash)

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
