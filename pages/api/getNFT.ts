//TODO Done
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NFT_load } from "../../src/interfaces";
import axios from "axios";
import { userInfo } from "os";
import { forIn } from "cypress/types/lodash";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { id } = req.body.data;
    try {
      if (id.length === 46) {
        //This is nft that in the block chain and didn't put any sale order yet
        const uri = `https://exclusives.infura-ipfs.io/ipfs/${id}`;
        const nft = await prisma.nFT.findUnique({
          where: {
            uri: uri,
          },
        });
        if (!nft) {
          throw new Error("Nft is not exist!!");
        }
        const owner = await prisma.owner.findUnique({
          where: {
            id: nft.ownerId,
          },
        });
        if (!owner) {
          throw new Error("Owner is not exist!!");
        }
        const ownedUser = await prisma.user.findUnique({
          where: { walletAddress: owner.walletAddress },
        });
        const { data } = await axios.get(
          `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTs?owner=${owner.walletAddress}`
        );

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
          const lazyNfts = await prisma.nFT.findUnique({
            where: {
              uri: data.ownedNfts[indexNo].tokenUri.raw,
            },
          });
          if (
            lazyNfts &&
            (lazyNfts.status === "ACTIVE" || lazyNfts.status === "REPORTED")
          ) {
            let royality = 0;
            if (ipfsData.data.royality) royality = ipfsData.data.royality;
            const creator = await prisma.user.findUnique({
              where: { walletAddress: ipfsData.data.creator },
            });
            const collection = await prisma.collection.findUnique({
              where: {
                collectionAddress: ipfsData.data.collection,
              },
            });
            if (!collection) {
              throw new Error("Collection is not in here");
            }
            const list: NFT_load[] = [
              {
                id: id,
                category: ipfsData.data.category,
                collection: ipfsData.data.collection,
                price: "0",
                offerPrice: "0",
                image: ipfsData.data.image,
                listed: false,
                tokenID: parseInt(data.ownedNfts[indexNo].id.tokenId, 16),
                uri: uri,
                endDate: "None",
                listingtype: "None",
                signature: "None",
                offerSignature: "None",
                sold: false,
                description: ipfsData.data.description,
                name: ipfsData.data.name,
                royality: royality,
                walletAddress: owner.walletAddress,
                creatorWalletAddress: ipfsData.data.creator,
                ownerUsername: ownedUser?.userName!,
                ownerUserID: ownedUser?.id!,
                creatorUsername: creator?.userName!,
                creatorUserID: creator?.id!,
                collectionName: collection.collectionName,
                collectionID: collection.id,
              },
            ];
            const activitCount = await prisma.activity.count({
              where: {
                nftId: lazyNfts.id,
                isExpired: true,
                NOT: { buyingprice: null },
              },
            });
            console.log(activitCount);
            res.status(201).json({
              message: "Successfully received",
              success: true,
              data: { nft: list, saleNum: activitCount },
            });
          } else {
            res.status(201).json({
              message: "No matching NFT",
              success: true,
              data: [],
            });
          }
        } else {
          res.status(201).json({
            message: "No matching NFT",
            success: true,
            data: [],
          });
        }
      } else {
        //it's data in DB
        const nft = await prisma.nFT.findUnique({
          where: {
            id: id,
          },
        });
        if (nft && (nft.status === "ACTIVE" || nft.status === "REPORTED")) {
          const owner = await prisma.owner.findUnique({
            where: {
              id: nft.ownerId,
            },
          });
          if (!owner) {
            throw new Error("Owner is not exist!!");
          }
          const ownedUser = await prisma.user.findUnique({
            where: { walletAddress: owner.walletAddress },
          });
          const activity = await prisma.activity.findFirst({
            where: { nftId: nft.id, isExpired: false },
          });

          const ipfsData = await axios.get(nft.uri);
          if (!ipfsData) throw new Error("Ipfs is not exist");
          let royality = 0;
          if (ipfsData.data.royality) {
            royality = ipfsData.data.royality;
          }
          const collection = await prisma.collection.findUnique({
            where: { collectionAddress: ipfsData.data.collection },
          });
          const creator = await prisma.user.findUnique({
            where: { walletAddress: ipfsData.data.creator },
          });

          let finalNFT: NFT_load[];
          if (activity) {
            const offer = await prisma.bidding.findFirst({
              where: {
                state: "ACCEPTED",
                isExpired: false,
                activityId: activity.id,
              },
            });
            let offerPrice = "0";
            if (offer) {
              offerPrice = offer.price;
            }
            finalNFT = [
              {
                id: nft.id,
                category: ipfsData.data.category,
                collection: ipfsData.data.collection,
                price: activity.sellingprice,
                offerPrice: offerPrice,
                image: ipfsData.data.image,
                listed: true,
                tokenID: nft.tokenID,
                uri: nft.uri,
                listingtype: activity.listingtype,
                endDate: activity.endDate.toString(),
                signature: activity.signature,
                offerSignature: activity.biddingSignature,
                sold: false,
                description: ipfsData.data.description,
                name: ipfsData.data.name,
                royality: royality,
                walletAddress: owner.walletAddress,
                creatorWalletAddress: ipfsData.data.creator,
                ownerUsername: ownedUser?.userName!,
                ownerUserID: ownedUser?.id!,
                creatorUsername: creator?.userName!,
                creatorUserID: creator?.id!,
                collectionName: collection?.collectionName!,
                collectionID: collection?.id!,
              },
            ];
          } else {
            finalNFT = [
              {
                id: nft.id,
                category: ipfsData.data.category,
                collection: ipfsData.data.collection,
                price: "0",
                offerPrice: "0",
                image: ipfsData.data.image,
                listed: false,
                tokenID: nft.tokenID,
                uri: nft.uri,
                endDate: "None",
                listingtype: "None",
                signature: "None",
                offerSignature: "None",
                sold: false,
                description: ipfsData.data.description,
                name: ipfsData.data.name,
                royality: royality,
                walletAddress: owner.walletAddress,
                creatorWalletAddress: ipfsData.data.creator,
                ownerUsername: ownedUser?.userName!,
                ownerUserID: ownedUser?.id!,
                creatorUsername: creator?.userName!,
                creatorUserID: creator?.id!,
                collectionName: collection?.collectionName!,
                collectionID: collection?.id!,
              },
            ];
          }
          const activitCount = await prisma.activity.count({
            where: {
              nftId: nft.id,
              isExpired: true,
              NOT: { buyingprice: null },
            },
          });
          console.log(activitCount);
          await prisma.$disconnect();
          res.status(201).json({
            message: "Successfully get",
            success: true,
            data: { nft: finalNFT, saleNum: activitCount },
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
      .status(405)
      .json({ message: "Method not allowed", success: false, data: [] });
  }
};
export default handler;
