//TODO Done
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const {
      collection,
      ownerWalletAddress,
      creatorWalletAddress,
      price,
      tokenID,
      uri,
      endDate,
      signature,
      saleWay,
    } = req.body.data;
    try {
      if (saleWay !== "FIXED_PRICE" && saleWay !== "TIMED_AUCTION")
        throw new Error("Sale way is not exist");
      const ipfsData = await axios.get(uri);
      if (!ipfsData) throw new Error("Ipfs is not exist");

      const { data: collectionMetaData } = await axios.get(
        `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getContractMetadata?contractAddress=${ipfsData.data.collection}`
      );
      if (!collectionMetaData) throw new Error("Contract address is not valid");
      let ownerUser = await prisma.user.findUnique({
        where: { walletAddress: ownerWalletAddress },
      });
      if (!ownerUser) {
        ownerUser = await prisma.user.create({
          data: { walletAddress: ownerWalletAddress },
        });
      }
      let owner = await prisma.owner.findUnique({
        where: { walletAddress: ownerWalletAddress },
      });
      if (!owner) {
        owner = await prisma.owner.create({
          data: {
            walletAddress: ownerWalletAddress,
            userId: ownerUser.id,
          },
        });
      }
      let creatorUser = await prisma.user.findUnique({
        where: { walletAddress: creatorWalletAddress },
      });
      if (!creatorUser) {
        creatorUser = await prisma.user.create({
          data: { walletAddress: creatorWalletAddress },
        });
      }
      let collectionData = await prisma.collection.findUnique({
        //TODO need to ask (when block chain nft put listed what is collection that we put)
        where: { collectionAddress: collection },
      });

      if (!collectionData) {
        collectionData = await prisma.collection.create({
          data: {
            creatorId: creatorUser.id,
            collectionName: collectionMetaData.contractMetadata.name,
            collectionAddress: collectionMetaData.address,
            collectionCategory: ipfsData.data.category,
            collectionDescription: "This is new to here",
          },
        });
      }
      let nft = await prisma.nFT.findUnique({ where: { uri: uri } });
      if (!nft) {
        nft = await prisma.nFT.create({
          data: {
            collectionId: collectionData.id,
            tokenID: tokenID,
            uri: uri,
            ownerId: owner.id,
          },
        });
      } else {
        await prisma.nFT.update({
          where: {
            id: nft.id,
          },
          data: {
            isMinted: false,
            ownerId: owner.id,
          },
        });
      }
      await prisma.activity.create({
        data: {
          nftId: nft.id,
          listingtype: saleWay,
          endDate: endDate,
          sellingprice: price,
          signature: signature,
        },
      });

      await prisma.$disconnect();
      res.status(204).json({ message: "Update successfully", success: true });
    } catch (error) {
      await prisma.$disconnect();
      res.status(400).json({ message: "Bad request", success: false });
    }
  } else {
    res.status(405).json({ message: "Method not alloed", success: false });
  }
};
export default handler;
