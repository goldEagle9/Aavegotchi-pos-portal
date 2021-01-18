/* global ethers run */

// aWETH
const rootTokenAddress = '0x030ba81f1c18d280636f32af80b9aad02cf0854e'
const userAddress1 = '0x66E7960EC00D100Ffc035f5d422107BcFA2A29a3'
const userAddress2 = '0x819C3fc356bb319035f9D2886fAc9E57DF0343F5'

async function main () {
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()

  const rootToken = await ethers.getContractAt('ChildERC20', rootTokenAddress)

  const balance1 = await rootToken.balanceOf(userAddress1)
  const balance2 = await rootToken.balanceOf(userAddress2)
  console.log(balance1.toString(), balance2.toString())
  console.log(balance1.sub(balance2).toString())

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
