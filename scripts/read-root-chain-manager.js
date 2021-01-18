/* global ethers run */

const { ethers } = require('hardhat')

// aWETH
const rootTokenAddress = '0x030ba81f1c18d280636f32af80b9aad02cf0854e'

const rootChainManagerAddress = '0x0D29aDA4c818A9f089107201eaCc6300e56E0d5c'

async function main () {
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()

  const rootChainManagerProxy = await ethers.getContractAt('ATokenRootChainManager', rootChainManagerAddress)
  const childTokenAddress = await rootChainManagerProxy.rootToChildToken(rootTokenAddress)
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
