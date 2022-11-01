//TODO Done
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NFT_load } from "../../src/interfaces";
import axios from "axios";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { id, ownerId } = req.body.data;
    const owner = await prisma.owner.findUnique({ where: { id: ownerId } });
    if (owner) {
      try {
        if (id.length === 46) {
          //This is nft that in the block chain and didn't put any sale order yet
          const ownerWalletAddress = owner?.walletAddress;
          const { data } = await axios.get(
            `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTs?owner=${ownerWalletAddress}`
          );
          const uri = `https://exclusives.infura-ipfs.io/ipfs/${id}`;
          const ipfsData = await axios.get(uri);
          let isValide = false;
          let indexNo = 0;
          for (let index = 0; index < data.ownedNfts.length; index++) {
            const element = data.ownedNfts[index];
            if (element.tokenUri.raw === uri) {
              isValide = true;
              indexNo = index;
            }
          }
          if (isValide) {
            let royality = 0;
            if (ipfsData.data.royality) {
              royality = ipfsData.data.royality;
            }
            const collection = await prisma.collection.findMany({
              where: {
                collectionAddress: ipfsData.data.collection,
              },
            });
            if (collection.length === 0) {
              let user = await prisma.user.findUnique({
                where: { walletAddress: ipfsData.data.creator },
              });
              if (!user) {
                user = await prisma.user.create({
                  data: { walletAddress: ipfsData.data.creator },
                });
              }
              await prisma.collection.create({
                data: {
                  creatorId: user.id,
                  collectionCategory: ipfsData.data.category,
                  collectionName: data.ownedNfts[indexNo].contractMetadata.name,
                  collectionAddress: ipfsData.data.collection,
                  collectionDescription: ipfsData.data.description,
                },
              });
            }
            const list: NFT_load[] = [
              {
                id: id,
                category: ipfsData.data.category,
                collection: ipfsData.data.collection,
                price: "0",
                image: ipfsData.data.image,
                listed: false,
                tokenID: parseInt(data.ownedNfts[indexNo].id.tokenId, 16),
                uri: uri,
                endDate: "None",
                listingtype: "None",
                signature: "None",
                sold: false,
                description: ipfsData.data.description,
                name: ipfsData.data.name,
                royality: royality,
                walletAddress: ownerWalletAddress,
                creatorWalletAddress: ipfsData.data.creator,
              },
            ];
            // console.log(list);
            res.status(201).json({
              message: "Successfully received",
              success: true,
              data: list,
            });
          } else {
            res.status(201).json({
              message: "No matching NFT",
              success: true,
              data: [],
            });
          }
        } else {
          //it's data in DB
          const nft = await prisma.nFT.findFirst({
            where: {
              id: id,
              isMinted: false,
            },
          });
          // console.log(nft);
          if (nft) {
            const activity = await prisma.activity.findFirst({
              where: { nftId: nft.id, isExpired: false },
            });

            const ipfsData = await axios.get(nft.uri);
            if (!ipfsData) throw new Error("Ipfs is not exist");
            let royality = 0;
            if (ipfsData.data.royality) {
              royality = ipfsData.data.royality;
            }
            let finalNFT: NFT_load[];
            if (activity) {
              finalNFT = [
                {
                  id: nft.id,
                  category: ipfsData.data.category,
                  collection: ipfsData.data.collection,
                  price: activity.sellingprice,
                  image: ipfsData.data.image,
                  listed: true,
                  tokenID: nft.tokenID,
                  uri: nft.uri,
                  listingtype: activity.listingtype,
                  endDate: activity.endDate.toString(),
                  signature: activity.signature,
                  sold: false,
                  description: ipfsData.data.description,
                  name: ipfsData.data.name,
                  royality: royality,
                  walletAddress: owner.walletAddress,
                  creatorWalletAddress: ipfsData.data.creator,
                },
              ];
            } else {
              finalNFT = [
                {
                  id: nft.id,
                  category: ipfsData.data.category,
                  collection: ipfsData.data.collection,
                  price: "0",
                  image: ipfsData.data.image,
                  listed: false,
                  tokenID: nft.tokenID,
                  uri: nft.uri,
                  endDate: "None",
                  listingtype: "None",
                  signature: "None",
                  sold: false,
                  description: ipfsData.data.description,
                  name: ipfsData.data.name,
                  royality: royality,
                  walletAddress: owner.walletAddress,
                  creatorWalletAddress: ipfsData.data.creator,
                },
              ];
            }
            await prisma.$disconnect();
            res.status(201).json({
              message: "Successfully get",
              success: true,
              data: finalNFT,
            });
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
        .status(401)
        .json({ message: "Unauthorized", success: false, data: [] });
    }
  } else {
    await prisma.$disconnect();
    res
      .status(405)
      .json({ message: "Method not allowed", success: false, data: [] });
  }
};
export default handler;
