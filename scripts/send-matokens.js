/* global ethers */

require('dotenv').config()

// Import Matic sdk for POS Portal
const MaticPOSClient = require('@maticnetwork/maticjs').MaticPOSClient
const HDWalletProvider = require('@truffle/hdwallet-provider')

const rootChainManagerAddress = '0x0D29aDA4c818A9f089107201eaCc6300e56E0d5c'

// maWETH
// const childTokenAddress = '0x20D3922b4a1A8560E1aC99FBA4faDe0c849e2142'

// maUSDC Child Token address: 0x9719d867A500Ef117cC201206B8ab51e794d3F82
const childTokenAddress = '0x9719d867A500Ef117cC201206B8ab51e794d3F82'

// maDAI Child Token address: 0xE0b22E0037B130A9F56bBb537684E6fA18192341
// const childTokenAddress = '0xE0b22E0037B130A9F56bBb537684E6fA18192341'

async function main () {
  // const accounts = await ethers.getSigners()
  // const account = await accounts[0].getAddress()
  // const userAddress1 = '0x66E7960EC00D100Ffc035f5d422107BcFA2A29a3' // SECRET2
  const userAddress2 = '0x819C3fc356bb319035f9D2886fAc9E57DF0343F5' // SECRET

  const maticPOSClient = new MaticPOSClient({
    network: 'mainnet',
    version: 'v1',
    parentProvider: new HDWalletProvider(process.env.SECRET, process.env.MAINNET_URL),
    maticProvider: new HDWalletProvider(process.env.SECRET, 'https://rpc-mainnet.matic.network'),
    posRootChainManager: rootChainManagerAddress
  })
  // const ERC20_TRANSFER_EVENT_SIG = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

  // const payload = await maticPOSClient.posRootChainManager.customPayload(burnHash, ERC20_TRANSFER_EVENT_SIG)
  // console.log(payload)

  // token burning
  // const childToken = await ethers.getContractAt('ChildERC20', childTokenAddress)
  // const balance = await childToken.balanceOf(userAddress2)
  // console.log(userAddress2, ' sending maToken balance:', balance.toString())

  // const tx = await maticPOSClient.burnERC20(childTokenAddress, balance.toString(), { from: userAddress2 })
  // console.log('maToken burn transaction hash: ', tx.transactionHash)

  // on ethereum the rootChainManager
  // aUSDC
  // atoken balance: 5.001541
  // scaled balance: 4.950305

  // maUSDC
  // 0x819C3fc356bb319035f9D2886fAc9E57DF0343F5  sending maToken balance: 4950305
  // maToken burn transaction hash:  0xab8940e142baf96ffcfcb7b247e0425c9657b6ec936d0bef1d5df8d870e7a1ab

  // on ethereum the rootChainManager
  // aDAI
  // atoken balance: 5001216201637282291 | 5001262568971673725
  // scaled balance: 4947358928937747456 | 4947358928937747456

  // maDAI
  // 0x819C3fc356bb319035f9D2886fAc9E57DF0343F5  sending maToken balance: 4947358928937747456
  // maToken burn transaction hash:  0xc7c7e001f6d0198053d50a0f01633edb6279bd041bc092a35c98539f1578859d

  const txHash = '0xc7c7e001f6d0198053d50a0f01633edb6279bd041bc092a35c98539f1578859d'

  const tx = await maticPOSClient.exitERC20(txHash, {
    from: userAddress2,
    gasPrice: 65000000000,
    gasLimit: 1000000
  })
  console.log("Exit hash: ", tx.transactionHash) // eslint-disable-line
}

// aUSDC: Exit hash:  0xbe0a5fa83f621e9d8df1ec21493518dadbbf36891fa2ed4d060a5fbcb9afffdb

// aDAI: Exit hash:  0xb18d8ea01dcdf89a1fbe0e61a8968e2d9746c5455f80ffa06a3aec78c5d1e1b2
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
