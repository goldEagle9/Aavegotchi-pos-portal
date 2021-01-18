/* global ethers */

function addCommas (nStr) {
  nStr += ''
  const x = nStr.split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? '.' + x[1] : ''
  var rgx = /(\d+)(\d{3})/
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2')
  }
  return x1 + x2
}

function strDisplay (str) {
  return addCommas(str.toString())
}

async function main () {
  // const accounts = await ethers.getSigners()
  // const account = await accounts[0].getAddress()

  const UChildERC20 = await ethers.getContractFactory('UChildERC20')
  const uChildERC20 = await UChildERC20.deploy()
  await uChildERC20.deployed()
  console.log('Deployed UChildERC20: ', uChildERC20.address)
  const tx = uChildERC20.deployTransaction
  const receipt = await tx.wait()
  console.log('deploy gas used:' + strDisplay(receipt.gasUsed))

  // const UChildERC20Proxy = await ethers.getContractFactory('UChildERC20Proxy')
  // let uChildERC20Proxy = await UChildERC20Proxy.deploy(uChildERC20.address)
  // await uChildERC20Proxy.deployed()
  // console.log('Deployed UChildERC20Proxy: ', uChildERC20Proxy.address)

  // uChildERC20Proxy = await ethers.getContractAt('UChildERC20', uChildERC20Proxy.address)

  // const name = 'Matic Aave interest bearing DAI'
  // const symbol = 'maDAI'
  // const decimals = 18
  // const childChainManager = '0x14aB595377e4fccCa46062A9109FFAC7FA4d3F18'

  // const tx = await uChildERC20Proxy.initialize(name, symbol, decimals, childChainManager)
  // console.log('Initializing: ', tx.hash)
  // const receipt = await tx.wait()

  // if (receipt.status) {
  //   console.log('ChildERC20 initialized successfully')
  // } else {
  //   console.log('ChildERC20 initialized faileddddddddddddddddddddd')
  // }
}

// Deployed UChildERC20:  0xDf36944e720cf5Af30a3C5D80d36db5FB71dDE40
// Deployed UChildERC20Proxy:  0x93eA6ec350Ace7473f7694D43dEC2726a515E31A
// Initializing:  0x747af3bb17704358f91a328d3ad8bfb555b1e8b986bdc002631ed498d1096289

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
