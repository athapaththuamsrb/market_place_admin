//TODO DONE
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Collection_Card, NFT_Card, Profile } from "../../src/interfaces";
import axios from "axios";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { userId } = req.body.data;
    const userData = {
      id: userId,
    };
    try {
      let user = await prisma.user.findUnique({
        where: userData,
      });
      if (user) {
        const userProfile: Profile = {
          walletAddress: user.walletAddress,
          userName: user.userName,
          bannerImage: user.bannerImage,
          profileImage: user.profileImage,
        };
        let collectionCards: Collection_Card[] = [];
        let collectedNFTCards: NFT_Card[] = [];
        let createdNFTCards: NFT_Card[] = [];
        const results = await prisma.collection.findMany({
          where: { creatorId: user.id },
        });
        if (results) {
          for (const result of results) {
            if (result.status === "BLOCKED") {
              continue;
            }
            collectionCards.push({
              id: result.id,
              collectionName: result.collectionName,
              featuredImage: result.featuredImage,
              logoImage: result.logoImage,
              category: result.collectionCategory,
            });
          }
        }
        let owner = await prisma.owner.findUnique({
          where: { walletAddress: user.walletAddress },
        });
        if (!owner) {
          owner = await prisma.owner.create({
            data: { walletAddress: user.walletAddress, userId: user.id },
          });
        }
        if (owner) {
          const nfts = await prisma.nFT.findMany();
          if (nfts.length !== 0) {
            for await (const nft of nfts) {
              const ipfsData = await axios.get(nft.uri);

              if (ipfsData.data.creator === user.walletAddress) {
                const creatorData = { walletAddress: ipfsData.data.creator };
                let userCreator = await prisma.user.findUnique({
                  where: creatorData,
                });
                if (!userCreator) {
                  userCreator = await prisma.user.create({
                    data: creatorData,
                  });
                }
                let ownerCreator = await prisma.owner.findUnique({
                  where: creatorData,
                });
                if (!ownerCreator) {
                  ownerCreator = await prisma.owner.create({
                    data: { ...creatorData, userId: userCreator.id },
                  });
                }
                const activity = await prisma.activity.findFirst({
                  where: {
                    nftId: nft.id,
                    isExpired: false,
                  },
                });
                let list: NFT_Card;
                if (activity) {
                  list = {
                    id: nft.id,
                    price: activity.sellingprice,
                    image: ipfsData.data.image,
                    name: ipfsData.data.name,
                    listed: true,
                    category: ipfsData.data.category,
                    ownerId: nft.ownerId,
                    ownerWalletAddress: ownerCreator.walletAddress,
                  };
                } else {
                  list = {
                    id: nft.id,
                    price: "0",
                    image: ipfsData.data.image,
                    name: ipfsData.data.name,
                    listed: false,
                    category: ipfsData.data.category,
                    ownerId: nft.ownerId,
                    ownerWalletAddress: ownerCreator.walletAddress,
                  };
                }
                createdNFTCards.push(list);
              } else if (nft.ownerId === owner.id) {
                if (nft.isMinted) continue;
                const activity = await prisma.activity.findFirst({
                  where: {
                    nftId: nft.id,
                    isExpired: false,
                  },
                });
                let list: NFT_Card;
                if (activity) {
                  list = {
                    id: nft.id,
                    price: activity.sellingprice,
                    image: ipfsData.data.image,
                    name: ipfsData.data.name,
                    listed: true,
                    category: ipfsData.data.category,
                    ownerId: owner.id,
                    ownerWalletAddress: owner.walletAddress,
                  };
                } else {
                  list = {
                    id: nft.id,
                    price: "0",
                    image: ipfsData.data.image,
                    name: ipfsData.data.name,
                    listed: false,
                    category: ipfsData.data.category,
                    ownerId: owner.id,
                    ownerWalletAddress: owner.walletAddress,
                  };
                }
                collectedNFTCards.push(list);
              }
            }
          }
          const { data } = await axios.get(
            `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTs?owner=${user.walletAddress}`
          );
          if (data.ownedNfts.length !== 0) {
            for await (const nft of data.ownedNfts) {
              const lazyNfts = await prisma.nFT.findUnique({
                where: {
                  uri: nft.tokenUri.raw,
                },
              });
              if (!lazyNfts) {
                continue;
              }
              const ipfsData = await axios.get(nft.tokenUri.raw);
              //TODO get block chain collection
              const { data: collectionMetaData } = await axios.get(
                `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getContractMetadata?contractAddress=${ipfsData.data.collection}`
              );
              let nftCreater = await prisma.user.findUnique({
                where: { walletAddress: ipfsData.data.creator },
              });
              if (!nftCreater) {
                nftCreater = await prisma.user.create({
                  data: { walletAddress: ipfsData.data.creator },
                });
              }
              let collection = await prisma.collection.findUnique({
                where: {
                  collectionAddress: collectionMetaData.address,
                },
              });
              if (!collection) {
                continue;
              }
              const list: NFT_Card = {
                id: nft.tokenUri.raw.split("/")[4],
                price: "0",
                image: ipfsData.data.image,
                name: ipfsData.data.name,
                listed: false,
                category: ipfsData.data.category,
                ownerId: owner.id,
                ownerWalletAddress: owner.walletAddress,
              };
              collectedNFTCards.push(list);
            }
          }
          res.status(201).json({
            message: "Successfully get",
            success: true,
            data: {
              collectionCards,
              collectedNFTCards,
              createdNFTCards,
              userProfile,
            },
          });
        } else {
          throw new Error("Owner is not exit");
        }
      }
    } catch (error) {
      await prisma.$disconnect();
      res
        .status(400)
        .json({ message: "User is not exit", success: false, data: [] });
    }
  } else {
    await prisma.$disconnect();
    res
      .status(405)
      .json({ message: "Method not allowed", success: false, data: [] });
  }
};
export default handler;
