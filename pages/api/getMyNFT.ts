//TODO DONE
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NFT_card } from "./../../src/interfaces";
import axios from "axios";
import { ethers } from "ethers";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (ethers.utils.isAddress(req.body.data.address)) {
      const userData = {
        walletAddress: req.body.data.address,
      };
      try {
        let user = await prisma.user.findUnique({
          where: userData,
        });
        if (!user) {
          user = await prisma.user.create({
            data: userData,
          });
        }
        let owner = await prisma.owner.findUnique({
          where: userData,
        });
        if (!owner) {
          owner = await prisma.owner.create({
            data: { ...userData, userId: user.id },
          });
        }

        const nfts = await prisma.nFT.findMany({
          where: {
            ownerId: owner.id,
            isMinted: false,
          },
        });
        const finslNFT: NFT_card[] = [];
        if (nfts.length !== 0) {
          for await (const nft of nfts) {
            const ipfsData = await axios.get(nft.uri);
            const activity = await prisma.activity.findFirst({
              where: {
                nftId: nft.id,
                isExpired: false,
              },
            });
            let list: NFT_card;
            if (activity) {
              list = {
                id: nft.id,
                price: activity.sellingprice,
                image: ipfsData.data.image,
                name: ipfsData.data.name,
                listed: true,
                category: ipfsData.data.category,
                ownerWalletAddress: userData.walletAddress,
              };
            } else {
              list = {
                id: nft.id,
                price: "0",
                image: ipfsData.data.image,
                name: ipfsData.data.name,
                listed: false,
                category: ipfsData.data.category,
                ownerWalletAddress: userData.walletAddress,
              };
            }
            finslNFT.push(list);
          }
        }

        const { data } = await axios.get(
          `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTs?owner=${userData.walletAddress}`
        );
        // console.log(data);
        if (data.ownedNfts.length !== 0) {
          for await (const nft of data.ownedNfts) {
            const lazyNfts = await prisma.nFT.findMany({
              where: {
                uri: nft.tokenUri.raw,
                isMinted: false,
              },
            });
            if (lazyNfts.length !== 0) {
              continue;
            }
            const ipfsData = await axios.get(nft.tokenUri.raw);
            const list: NFT_card = {
              id: nft.tokenUri.raw.split("/")[4],
              price: "0",
              image: ipfsData.data.image,
              name: ipfsData.data.name,
              listed: false,
              category: ipfsData.data.category,
              ownerWalletAddress: owner.walletAddress,
            };
            finslNFT.push(list);
          }
        }

        res.status(201).json({
          message: "Successfully received",
          success: true,
          data: finslNFT,
        });
      } catch (error) {
        await prisma.$disconnect();
        res
          .status(400)
          .json({ message: "Bad request", success: false, data: [] });
      }
    } else {
      res
        .status(401)
        .json({ message: "Unauthorized", success: false, data: [] });
    }
  } else {
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
