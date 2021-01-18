/* global ethers */

// aWETH
// const rootTokenAddress = '0x030ba81f1c18d280636f32af80b9aad02cf0854e'
// aUSDC
const rootTokenAddress = '0xBcca60bB61934080951369a648Fb03DF4F96263C'
const rootChainManagerAddress = '0x0D29aDA4c818A9f089107201eaCc6300e56E0d5c'

async function main () {
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()

  const rootChainManager = await ethers.getContractAt('ATokenRootChainManager', rootChainManagerAddress)
  const rootToken = await ethers.getContractAt('ChildERC20', rootTokenAddress)

  let amount = await rootToken.balanceOf(account)
  let allowance = await rootToken.allowance(account, rootChainManagerAddress)
  let tx
  let receipt
  if (amount.gt(allowance)) {
    allowance = amount.add(ethers.utils.parseEther('1000000'))
    tx = await rootToken.approve(rootChainManagerAddress, allowance)
    console.log('Approving allowance:', allowance.toString(), 'TX: ', tx.hash)
    receipt = await tx.wait()
    if (receipt.status) {
      console.log('Approved')
    } else {
      throw Error('Approval failed')
    }
  }
  amount = (await rootToken.balanceOf(account)).div(2)
  console.log('Sending ', amount.toString())
  console.log('Token:', rootTokenAddress)
  console.log('Receipent:', account)

  //   function depositFor(
  //     address user,
  //     address rootToken,
  //     bytes memory depositData
  amount = ethers.utils.defaultAbiCoder.encode(['uint256'], [amount])
  tx = await rootChainManager.depositFor(account, rootTokenAddress, amount)
  console.log('Deposit transaction: ', tx.hash)
  receipt = await tx.wait()
  if (receipt.status) {
    console.log('Deposit success')
  } else {
    throw Error('Deposit fail')
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
