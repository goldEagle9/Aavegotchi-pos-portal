/* global ethers run */

const { ethers } = require('hardhat')

const rootChainManagerAddress = '0x0D29aDA4c818A9f089107201eaCc6300e56E0d5c'

// aUSDC
const aTokenContractAddress = '0xbcca60bb61934080951369a648fb03df4f96263c'
// aDAI
// const aTokenContractAddress = '0x028171bca77440897b824ca71d1c56cac55b68a3'

async function main () {
  const rootChainManagerProxy = await ethers.getContractAt('ATokenRootChainManager', rootChainManagerAddress)
  const aTokenValue = ethers.utils.parseEther('522')
  const maTokenValue = await rootChainManagerProxy.getMATokenValue(aTokenContractAddress, aTokenValue)
  console.log(`aToken value ${aTokenValue.toString()} converted to maTokenValue: ${maTokenValue.toString()}`)
}

// Child token addresses
// maDAI Child Token address: 0xE0b22E0037B130A9F56bBb537684E6fA18192341
// maUSDC Child Token address: 0x9719d867A500Ef117cC201206B8ab51e794d3F82
// maWETH Child Token address: 0x20D3922b4a1A8560E1aC99FBA4faDe0c849e2142

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
