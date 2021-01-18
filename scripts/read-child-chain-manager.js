/* global ethers run */

const { ethers } = require('hardhat')

// aWETH
const rootTokenAddress = '0x030ba81f1c18d280636f32af80b9aad02cf0854e'

const childChainManagerAddress = '0x4fe23a33922BcC5e560fdd74A84cDDe4D2BdaaAC'

async function main () {
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()

  const childChainManagerProxy = await ethers.getContractAt('ChildChainManager', childChainManagerAddress)
  const childTokenAddress = await childChainManagerProxy.rootToChildToken(rootTokenAddress)
  console.log('Child Token address:', childTokenAddress)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
