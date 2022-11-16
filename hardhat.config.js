require("@nomiclabs/hardhat-waffle");
require("dotenv/config");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: "0.8.7",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    goerli: {
      url: process.env.GO_URL, //Infura url with projectId
      accounts: [process.env.GO_ACCOUNT], // add the account that will deploy the contract (private key)
      // accounts: [
      //   "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      // ],
    },
  },
};
