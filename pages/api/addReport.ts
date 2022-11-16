import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { reportedId, reportType, reporterWalletAddress, reason } =
      req.body.data;
    try {
      let user = await prisma.user.findUnique({
        where: {
          walletAddress: reporterWalletAddress,
        },
      });
      if (!user) throw new Error("User does not exist");

      const report = await prisma.report.create({
        data: {
          reportedId: reportedId[0],
          reportType: reportType,
          reporterId: user.id,
          reason: reason,
          STATUS: "REPORTED",
        },
      });
      if (report) {
        console.log(report);
        switch (reportType) {
          //TODO - NFTs not present in DB
          case "NFT":
            if (reportedId[0].length === 46) {
              let ownedUser = await prisma.user.findUnique({
                where: { id: reportedId[1] },
              });
              console.log(ownedUser);
              if (ownedUser) {
                let owner = await prisma.owner.findUnique({
                  where: { userId: reportedId[1] },
                });
                if (!owner) {
                  owner = await prisma.owner.create({
                    data: {
                      walletAddress: ownedUser.walletAddress,
                      userId: reportedId[1],
                    },
                  });
                }
                console.log(owner);
                // const { data } = await axios.get(
                //   `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getNFTs?owner=${ownedUser.walletAddress}`
                // );
                const uri = `https://exclusives.infura-ipfs.io/ipfs/${reportedId[0]}`;
                const ipfsData = await axios.get(uri);
                const { data: collectionMetaData } = await axios.get(
                  `https://eth-goerli.g.alchemy.com/nft/v2/${process.env.API_KEY}/getContractMetadata?contractAddress=${ipfsData.data.collection}`
                );
                if (!collectionMetaData)
                  throw new Error("Contract address is not valid");

                let collection = await prisma.collection.findFirst({
                  where: {
                    collectionAddress: ipfsData.data.collection,
                  },
                });
                if (!collection) {
                  throw new Error("Collection is not exist!!!");
                }
                console.log(collection);
                console.log(collection.id, reportedId[2], uri, owner.id);
                let nft1 = await prisma.nFT.findUnique({ where: { uri: uri } });
                if (!nft1) throw new Error("NFT is not exist");
                console.log(nft1);
                await prisma.nFT.update({
                  where: {
                    id: nft1.id,
                  },
                  data: {
                    status: "REPORTED",
                  },
                });
                await prisma.report.update({
                  where: {
                    id: report.id,
                  },
                  data: {
                    reportedId: nft1.id,
                  },
                });
              } else {
                throw new Error("User does nor exist");
              }
            } else {
              let nft = await prisma.nFT.findFirst({
                where: { id: reportedId[0] },
              });
              if (nft) {
                await prisma.nFT.update({
                  where: {
                    id: reportedId[0],
                  },
                  data: {
                    status: "REPORTED",
                  },
                });
              } else {
                throw new Error("nft is not exit");
              }
            }
            break;
          case "Collection":
            await prisma.collection.update({
              where: {
                id: reportedId[0],
              },
              data: {
                status: "REPORTED",
              },
            });
            break;
          case "USER":
            await prisma.user.update({
              where: {
                id: reportedId[0],
              },
              data: {
                status: "REPORTED",
              },
            });

            break;
          default:
            throw new Error("Report Type does not exist!");
        }
      } else {
        throw new Error("Report creation error!");
      }
      res.status(201).json({
        message: "Successful!",
        success: true,
      });
    } catch (error) {
      await prisma.$disconnect();
      res
        .status(400)
        .json({ message: "User does not exit", success: false, data: [] });
    }
  } else {
    res.status(401).json({ message: "Unauthorized", success: false, data: [] });
  }
};
export default handler;
