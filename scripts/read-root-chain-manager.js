/* global ethers run */

const { ethers } = require('hardhat')

// aWETH Root Token ddress:
// const rootTokenAddress = '0x030ba81f1c18d280636f32af80b9aad02cf0854e'
// aUSDC
// const rootTokenAddress = '0xBcca60bB61934080951369a648Fb03DF4F96263C'
// aDAI
// const rootTokenAddress = '0x028171bca77440897b824ca71d1c56cac55b68a3'
// aAAVE
// const rootTokenAddress = '0xFFC97d72E13E01096502Cb8Eb52dEe56f74DAD7B'
// aLINK
// const rootTokenAddress = '0xa06bC25B5805d5F8d82847D191Cb4Af5A3e873E0'
// aUSDT
// const rootTokenAddress = '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811'
// aTUSD
// const rootTokenAddress = '0x101cc05f4A51C0319f570d5E146a8C625198e636'
// aUNI
// const rootTokenAddress = '0xB9D7CB55f463405CDfBe4E90a6D2Df01C2B92BF1'
// aYFI
// const rootTokenAddress = '0x5165d24277cD063F5ac44Efd447B27025e888f37'

// aWETH Root Token address: 0x030ba81f1c18d280636f32af80b9aad02cf0854e
// aUSDC Root Token address: 0xBcca60bB61934080951369a648Fb03DF4F96263C
// aDAI Root Token address:  0x028171bca77440897b824ca71d1c56cac55b68a3
// aAAVE Root Token address: 0xFFC97d72E13E01096502Cb8Eb52dEe56f74DAD7B
// aLINK Root Token address: 0xa06bC25B5805d5F8d82847D191Cb4Af5A3e873E0
// aUSDT Root Token address: 0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811
// aTUSD Root Token address: 0x101cc05f4A51C0319f570d5E146a8C625198e636
// aUNI Root Token address: 0xB9D7CB55f463405CDfBe4E90a6D2Df01C2B92BF1
// aYFI Root Token address: 0x5165d24277cD063F5ac44Efd447B27025e888f37

const rootChainManagerAddress = '0x0D29aDA4c818A9f089107201eaCc6300e56E0d5c'

async function main () {
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()

  const rootChainManagerProxy = await ethers.getContractAt('ATokenRootChainManager', rootChainManagerAddress)
  const childTokenAddress = await rootChainManagerProxy.rootToChildToken(rootTokenAddress)
  console.log('Child Token address:', childTokenAddress)
}

// Child token addresses
// maDAI Child Token address: 0xE0b22E0037B130A9F56bBb537684E6fA18192341
// maUSDC Child Token address: 0x9719d867A500Ef117cC201206B8ab51e794d3F82
// maWETH Child Token address: 0x20D3922b4a1A8560E1aC99FBA4faDe0c849e2142
// maAAVE Child Token address: 0x823CD4264C1b951C9209aD0DeAea9988fE8429bF
// maLINK Child Token address: 0x98ea609569bD25119707451eF982b90E3eb719cD
// maUSDT Child Token address: 0xDAE5F1590db13E3B40423B5b5c5fbf175515910b
// maTUSD Child Token address: 0xF4b8888427b00d7caf21654408B7CBA2eCf4EbD9
// maUNI Child Token address: 0x8c8bdBe9CeE455732525086264a4Bf9Cf821C498
// maYFI Child Token address: 0xe20f7d1f0eC39C4d5DB01f53554F2EF54c71f613

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
