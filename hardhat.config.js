require("@nomiclabs/hardhat-waffle");
require("dotenv/config");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: process.env.GO_URL, //Infura url with projectId
      accounts: [process.env.GO_ACCOUNT], // add the account that will deploy the contract (private key)
    },
  },
};
