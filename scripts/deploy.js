const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Marketplace = await ethers.getContractFactory("Marketplace");
  // deploy marketplace contracts
  const marketplace = await Marketplace.deploy(1);

  // Get the ContractFactories and Signers here.
  const Factory = await ethers.getContractFactory("Factory");
  // deploy contracts
  const factory = await Factory.deploy(marketplace.address);

  // const Collection = await ethers.getContractFactory("Collection");
  // // deploy marketplace contracts
  // const collection = await Collection.deploy(
  //   "collection-1",
  //   "Collection",
  //   marketplace.address
  // );
  // Save copies of each contracts abi and address to the frontend.
  saveFrontendFiles(marketplace, "Marketplace");
  saveFrontendFiles(factory, "Factory");
  // saveFrontendFiles(collection, "Collection");
}

function saveFrontendFiles(contract, name) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
