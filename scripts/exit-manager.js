/* global ethers run */

const Web3 = require('web3')

const web3 = new Web3('https://rpc-mainnet.matic.network)

const ERC20_TRANSFER_EVENT_SIG = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

async function buildPayloadForExitHermoine (burnTxHash) {

}

async function main () {

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
