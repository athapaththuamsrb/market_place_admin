import { ethers } from "ethers";
import type { NextPage } from "next";
import { useSigner, useContract, useAccount } from "wagmi";
import MarketplaceAddress from "../contractsData/Marketplace-address.json";
import MarketplaceAbi from "../contractsData/Marketplace.json";

const Test: NextPage = (props) => {
  const { data: signer, isError, isLoading } = useSigner(); //TODO data is useSigner attibute we assign that value to signer
  const marketplace_ = useContract({
    //TODO create connection with marketplace
    addressOrName: MarketplaceAddress.address,
    contractInterface: MarketplaceAbi.abi,
    signerOrProvider: signer,
  });
  const nftData = {
    //TODO set data
    tokenID: 0,
    uri: "https://exclusives.infura-ipfs.io/ipfs/QmTAiGmri7qKMwEXTTH9PfMZh8gNhowArjEQEozWCuQDMS",
    creator: "0xaa4219d1614bb5ac4687164748aadde996c309e8",
    category: "Sports",
    collection: "0x22bcdc916aa6556f0dc47159c5b37077a144e67c",
    royality: 1,
    price: ethers.utils.parseEther("0.001"),
  };

  const addMint = async () => {
    console.log(nftData);
    const tokenID = await marketplace_.lazyMintNFT(
      //TODO add blockchain
      nftData,
      "0x53f5a3428a780a93c5267e0388149d9480d87ccd2a5bc7bb655b1335ad6d252821ae59acbf3f78e91f172ce3d898155c17e15fce1e378de0a20c5af68a2e97ac1c",
      { value: nftData.price }
    );
  };
  //addMint();

  return (
    <div>
      {" "}
      <button onClick={addMint}>came</button>{" "}
    </div>
  );
};
export default Test;
