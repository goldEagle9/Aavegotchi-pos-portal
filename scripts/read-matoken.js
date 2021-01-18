/* global ethers run */

// aWETH
const childTokenAddress = '0x20D3922b4a1A8560E1aC99FBA4faDe0c849e2142'
const userAddress = '0x819C3fc356bb319035f9D2886fAc9E57DF0343F5'

async function main () {
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()

  const childToken = await ethers.getContractAt('ChildERC20', childTokenAddress)

  const balance = await childToken.balanceOf(userAddress)
  console.log(balance.toString())
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
