//TODO Done
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import Collection from "../account/collection";
import authToken from "../../services/auth.token";
import { ethers } from "ethers";

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
      token,
    } = req.body.data;
    await authToken.userAuthToken(token).then(async (address) => {
      if (ethers.utils.isAddress(address!) && typeof address == "string") {
        try {
          if (ownerWalletAddress !== address)
            throw new Error("Miss match of owner address");
          if (saleWay !== "FIXED_PRICE" && saleWay !== "TIMED_AUCTION")
            throw new Error("Sale way is not exist");
          const ipfsData = await axios.get(uri);
          if (!ipfsData) throw new Error("Ipfs is not exist");
          const { data: collectionMetaData } = await axios.get(
            `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getContractMetadata?contractAddress=${ipfsData.data.collection}`
          );
          if (!collectionMetaData)
            throw new Error("Contract address is not valid");
          let ownerUser = await prisma.user.findUnique({
            where: { walletAddress: address },
          });
          if (!ownerUser) {
            ownerUser = await prisma.user.create({
              data: { walletAddress: address },
            });
          }
          let owner = await prisma.owner.findUnique({
            where: { walletAddress: address },
          });
          if (!owner) {
            owner = await prisma.owner.create({
              data: {
                walletAddress: address,
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
            throw new Error("Collection is not exist");
          }
          let nft = await prisma.nFT.findUnique({ where: { uri: uri } });
          if (!nft) throw new Error("NFT is not exist");

          await prisma.nFT.update({
            where: {
              id: nft.id,
            },
            data: {
              isMinted: false,
              tokenID: tokenID,
              ownerId: owner.id,
            },
          });

          await prisma.activity.create({
            data: {
              nftId: nft.id,
              listingtype: saleWay,
              endDate: endDate,
              sellingprice: price,
              signature: signature,
              userId: ownerUser.id,
            },
          });

          //get NFTs in particular collection
          const nfts = await prisma.nFT.findMany({
            where: {
              collectionId: collection,
            },
          });
          let buyings: number[] = [];
          var floor_price: number = 0;
          //find floor  price from all nfts in the updated collection
          for (let nft of nfts) {
            await prisma.activity
              .findFirst({
                where: {
                  nftId: nft.id,
                  isExpired: false,
                },
              })
              .then((data) => {
                if (data?.sellingprice) {
                  buyings.push(Number(data?.sellingprice));
                }
                floor_price = Math.min.apply(null, buyings);
              });
          }
          //update floor price
          await prisma.collection.update({
            where: {
              id: collectionData.id,
            },
            data: {
              floorPrice: String(floor_price),
            },
          });

          await prisma.$disconnect();
          res
            .status(204)
            .json({ message: "Update successfully", success: true });
        } catch (error) {
          console.log(error);
          await prisma.$disconnect();
          res.status(400).json({ message: "Bad request", success: false });
        }
      } else {
        res.status(401).json({ message: "Unauthorized", success: false });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed", success: false });
  }
};
export default handler;
