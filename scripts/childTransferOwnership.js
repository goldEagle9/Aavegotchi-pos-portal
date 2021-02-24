/* global ethers */

async function main () {
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()
  const multiSigAddress = '0x258cC4C495Aef8D809944aD94C6722ef41216ef3'

  const childChainManager = await ethers.getContractAt('ATokenChildChainManager', '0x4fe23a33922BcC5e560fdd74A84cDDe4D2BdaaAC')
  let tx = await childChainManager.setOwner(multiSigAddress)
  console.log('Setting childChainManager owner: ', tx.hash)
  let receipt = await tx.wait()
  if (receipt.status) {
    console.log('ChildChainManager owner set successfully')
  } else {
    throw Error('ChildChainManager owner set faileddddddddddddddddddddd')
  }

  const childChainManagerProxy = await ethers.getContractAt('ChildChainManagerProxy', '0x4fe23a33922BcC5e560fdd74A84cDDe4D2BdaaAC')
  tx = await childChainManagerProxy.transferProxyOwnership(multiSigAddress)
  console.log('Setting childChainManagerProxy owner: ', tx.hash)
  receipt = await tx.wait()
  if (receipt.status) {
    console.log('ChildChainManagerProxy owner set successfully')
  } else {
    throw Error('ChildChainManagerProxy owner set faileddddddddddddddddddddd')
  }

  const children = [
    { symbol: 'maDAI', address: '0xE0b22E0037B130A9F56bBb537684E6fA18192341' },
    { symbol: 'maUSDC', address: '0x9719d867A500Ef117cC201206B8ab51e794d3F82' },
    { symbol: 'maWETH', address: '0x20D3922b4a1A8560E1aC99FBA4faDe0c849e2142' }
  ]

  let childERC20
  for (const child of children) {
    childERC20 = await ethers.getContractAt('UChildERC20Proxy', child.address)
    tx = await childERC20.transferProxyOwnership(multiSigAddress)
    console.log(`Setting ${child.symbol} childERC20 owner: `, tx.hash)
    receipt = await tx.wait()
    if (receipt.status) {
      console.log(`ChildERC20 ${child.symbol} owner set successfully`)
    } else {
      throw Error(`ChildERC20 ${child.symbol} owner set faileddddddddddddddddddddd`)
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
