/* global ethers run */

// aWETH
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
const rootTokenAddress = '0x5165d24277cD063F5ac44Efd447B27025e888f37'

const rootChainManagerAddress = '0x0D29aDA4c818A9f089107201eaCc6300e56E0d5c'

async function main () {
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()

  const rootChainManagerProxy = await ethers.getContractAt('ATokenRootChainManager', rootChainManagerAddress)

  const tx = await rootChainManagerProxy.mapToken(rootTokenAddress)
  console.log('Mapping token: ', tx.hash)

  const receipt = await tx.wait()

  if (receipt.status) {
    console.log('Mapping successful')
  } else {
    console.log('Mapping failed')
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
