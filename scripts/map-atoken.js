/* global ethers run */

// aWETH
// const rootTokenAddress = '0x030ba81f1c18d280636f32af80b9aad02cf0854e'
// aUSDC
// const rootTokenAddress = '0xBcca60bB61934080951369a648Fb03DF4F96263C'
// aDAI
const rootTokenAddress = '0x028171bca77440897b824ca71d1c56cac55b68a3'

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
