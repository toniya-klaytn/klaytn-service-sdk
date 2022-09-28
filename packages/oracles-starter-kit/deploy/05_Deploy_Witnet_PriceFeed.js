const { getNamedAccounts, deployments, network, run } = require("hardhat")
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config")
const { verify } = require("../helper-functions")
const { networks } = require("../hardhat.config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  let priceFeedAddress = networkConfig[chainId]["witnetPriceRouter"]
  
  // Price Feed Address, values can be obtained at https://docs.witnet.io/smart-contracts/witnet-data-feeds/addresses
  // Default one below is KLAY/USDT contract on Baobab
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS
  log("----------------------------------------------------")
  const priceConsumerV3 = await deploy("WitnetPriceFeed", {
    from: deployer,
    args: [priceFeedAddress],
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })

  //TODO: implement verify
  // Verify the deployment
  // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  //   log("Verifying...")
  //   await verify(WitnetPriceFeed.address, [priceFeedAddress])
  // }

  log("Run Witnet Price Feed contract with command:")
  const networkName = network.name == "hardhat" ? "localhost" : network.name
  log(`yarn hardhat read-witnet-price-feed --contract ${priceConsumerV3.address} --network ${networkName}`)
  log("----------------------------------------------------")
}

module.exports.tags = ["all", "feed", "main"]
