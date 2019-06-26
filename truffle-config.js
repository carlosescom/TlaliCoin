require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");
const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://ropsten.infura.io/v3/" + process.env.INFURA_APIKEY, 0, 10, process.env.DERIV_PATH
        )
      },
      network_id: 3
    },
  },
  compilers: {
    solc: {
      version: '0.5.8'
    }
  }
};
