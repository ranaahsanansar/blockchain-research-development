module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/BrkTuD9WoO3ACphJ3Iv8M1TvnVnvTX9g",
      accounts: ["115599ed6967fb544e58d739ea5ed29aa900b45d9335ae61421538ee6ae6151d"]
    }
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
}


// https://sepolia.drpc.org
// 115599ed6967fb544e58d739ea5ed29aa900b45d9335ae61421538ee6ae6151d