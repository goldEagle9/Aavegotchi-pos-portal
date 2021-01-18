/* global ethers */

require('dotenv').config()

// Import Matic sdk for POS Portal
const MaticPOSClient = require('@maticnetwork/maticjs').MaticPOSClient
const HDWalletProvider = require('@truffle/hdwallet-provider')

// maWETH
const childTokenAddress = '0x20D3922b4a1A8560E1aC99FBA4faDe0c849e2142'
const rootChainManagerAddress = '0x0D29aDA4c818A9f089107201eaCc6300e56E0d5c'

async function main () {
  // const accounts = await ethers.getSigners()
  // const account = await accounts[0].getAddress()
  const userAddress1 = '0x66E7960EC00D100Ffc035f5d422107BcFA2A29a3' // SECRET2
  const userAddress2 = '0x819C3fc356bb319035f9D2886fAc9E57DF0343F5' // SECRET

  const maticClient = new MaticPOSClient({
    parentProvider: new HDWalletProvider(process.env.SECRET, process.env.MAINNET_URL),
    maticProvider: new HDWalletProvider(process.env.SECRET2, 'https://rpc-mainnet.matic.network'),
    posRootChainManager: rootChainManagerAddress,
    posERC20Predicate: rootChainManagerAddress,
    parentDefaultOptions: { from: userAddress2 },
    maticDefaultOptions: { from: userAddress1 }
  })

  // token burming
  // const childToken = await ethers.getContractAt('ChildERC20', childTokenAddress)
  // const balance = await childToken.balanceOf(userAddress1)
  // console.log(userAddress1, ' sending maToken balance:', balance.toString())

  const burnHash = '0x5b1ed3627b10f23a9a6bc4cdb25e84351943b6edf0a16d374d44cc5d43d15043'
  const tx = await maticClient.exitERC20(burnHash, {
    from: userAddress2,
    gasPrice: 65000000000,
    gasLimit: 1000000
  })
  console.log("Exit hash: ", tx.transactionHash) // eslint-disable-line

  //   const tx = await maticClient.burnERC20(childTokenAddress, balance.toString())
  //   console.log('maToken burn transaction hash: ', tx.transactionHash)

  //   const rootChainManager = await ethers.getContractAt('ATokenRootChainManager', rootChainManagerAddress)
  //   const rootToken = await ethers.getContractAt('ChildERC20', rootTokenAddress)

  //   let amount = await rootToken.balanceOf(account)
  //   let allowance = await rootToken.allowance(account, rootChainManagerAddress)
  //   let tx
  //   let receipt
  //   if (amount.gt(allowance)) {
  //     allowance = amount.add(ethers.utils.parseEther('1000000'))
  //     tx = await rootToken.approve(rootChainManagerAddress, allowance)
  //     console.log('Approving allowance:', allowance.toString(), 'TX: ', tx.hash)
  //     receipt = await tx.wait()
  //     if (receipt.status) {
  //       console.log('Approved')
  //     } else {
  //       throw Error('Approval failed')
  //     }
  //   }
  //   amount = (await rootToken.balanceOf(account)).div(2)
  //   console.log('Sending ', amount.toString())
  //   console.log('Token:', rootTokenAddress)
  //   console.log('Receipent:', account)

  //   //   function depositFor(
  //   //     address user,
  //   //     address rootToken,
  //   //     bytes memory depositData
  //   amount = ethers.utils.defaultAbiCoder.encode(['uint256'], [amount])
  //   tx = await rootChainManager.depositFor(account, rootTokenAddress, amount)
  //   console.log('Deposit transaction: ', tx.hash)
  //   receipt = await tx.wait()
  //   if (receipt.status) {
  //     console.log('Deposit success')
  //   } else {
  //     throw Error('Deposit fail')
  //   }

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
