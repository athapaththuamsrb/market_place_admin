import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NFT_load } from "../../src/interfaces";
import axios from "axios";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { id } = req.body.data;
    try {
      if (id.length === 46) {
        //This is nft that in the block chain and didn't put any sale order yet
        const ownerWalletAddress = req.body.data.ownerWalletAddress;
        const { data } = await axios.get(
          `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTs?owner=${ownerWalletAddress}`
        );
        const uri = `https://exclusives.infura-ipfs.io/ipfs/${id}`;
        const ipfsData = await axios.get(uri);
        // console.log("came-1");
        let isValide = false;
        let indexNo = 0;
        for (let index = 0; index < data.ownedNfts.length; index++) {
          const element = data.ownedNfts[index];
          if (element.tokenUri.raw === uri) {
            console.log(element);
            isValide = true;
            indexNo = index;
          }
        }
        if (isValide) {
          const nft_r = await await prisma.nFT.findFirst({
            where: {
              uri: uri,
              sold: true,
              isDelete: false,
            },
          });
          // console.log(nft_r);
          if (nft_r) {
            const list: NFT_load[] = [
              {
                id: id,
                category: ipfsData.data.category,
                collection: ipfsData.data.collection,
                price: "0",
                image: ipfsData.data.image,
                listed: false,
                tokenID: parseInt(data.ownedNfts[indexNo].id.tokenId, 16), //TODO??
                uri: uri,
                signature: "not here",
                sold: false,
                description: ipfsData.data.description,
                name: ipfsData.data.name,
                royality: nft_r.royality,
                walletAddress: ownerWalletAddress, //TODO??
                creatorWalletAddress: ipfsData.data.creator,
              },
            ];
            res.status(201).json({
              message: "Successfully received",
              success: true,
              data: list,
            });
          } else {
            res.status(201).json({
              message: "No maching NFT",
              success: true,
              data: [],
            });
          }
        } else {
          res.status(201).json({
            message: "No maching NFT",
            success: true,
            data: [],
          });
        }
      } else {
        //it's data in DB
        const nft = await prisma.nFT.findFirst({
          where: {
            id: id,
            isDelete: false,
          },
        });
        if (nft) {
          const owner = await prisma.owner.findUnique({
            where: {
              id: nft.ownerId,
            },
          });
          const creator = await prisma.creator.findUnique({
            where: {
              id: nft.creatorId,
            },
          });
          await prisma.$disconnect();
          if (owner && creator) {
            const finalNFT: NFT_load[] = [
              {
                id: nft.id,
                category: nft.category,
                collection: nft.collection,
                price: nft.price,
                image: nft.image,
                listed: nft.listed,
                tokenID: nft.tokenID,
                uri: nft.uri,
                signature: nft.signature,
                sold: nft.sold,
                description: nft.description,
                name: nft.name,
                royality: nft.royality,
                walletAddress: owner.walletAddress,
                creatorWalletAddress: creator.walletAddress,
              },
            ];
            res.status(201).json({
              message: "Successfully get",
              success: true,
              data: finalNFT,
            });
          }
        } else {
          throw new Error("nft is not exit");
        }
      }
    } catch {
      await prisma.$disconnect();
      res
        .status(400)
        .json({ message: "Bad request", success: false, data: [] });
    }
  } else {
    await prisma.$disconnect();
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
