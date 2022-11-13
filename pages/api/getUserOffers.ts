import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { OfferToAccept } from "../../src/interfaces";
import authToken from "../../services/auth.token";
import { ethers } from "ethers";
import axios from "axios";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { token } = req.body.data;

    let msg: string;
    await authToken.userAuthToken(token).then(async (address) => {
      if (ethers.utils.isAddress(address!) && typeof address == "string") {
        try {
          const user = await prisma.user.findUnique({
            where: { walletAddress: address },
          });
          if (!user) throw new Error("user is not exist");
          let owner = await prisma.owner.findUnique({
            where: { walletAddress: address },
          });
          if (!owner)
            owner = await prisma.owner.create({
              data: { walletAddress: address, userId: user.id },
            });
          const activities = await prisma.activity.findMany({
            where: {
              isPenddingPayment: true,
              isExpired: false,
              listingtype: "TIMED_AUCTION",
            },
          });
          if (activities.length !== 0) {
            const offersList: OfferToAccept[] = [];
            for await (const activity of activities) {
              const offer = await prisma.bidding.findFirst({
                where: {
                  activityId: activity.id,
                  isPaid: false,
                  state: "ACCEPTED",
                },
              });
              if (offer) {
                if (offer.userId === user.id) {
                  const id = activity.nftId;
                  const nft = await prisma.nFT.findUnique({
                    where: {
                      id: id,
                    },
                  });
                  console.log("efweg");
                  const ipfsData = await axios.get(nft?.uri!);
                  console.log("evewg");
                  if (nft) {
                    let off: OfferToAccept = {
                      id: offer.id,
                      price: offer.price,
                      nftId: id,
                      nftName: ipfsData.data.name,
                      nftUrl: nft.isMinted ? nft.uri.split("/")[4] : id,
                      owner: nft?.ownerId!,
                      expiration: offer.timestamp.toLocaleDateString(),
                      isExpired: offer.isExpired,
                      state:
                        offer.state === "PENDDING" ? "PENDING" : offer.state,
                      isPaid: offer.isPaid,
                      tokenID: parseInt(ipfsData.data.tokenId),
                      uri: nft?.uri!,
                      creator: ipfsData.data.creator,
                      category: ipfsData.data.category,
                      collection: ipfsData.data.collection,
                      royality: ipfsData.data.royality,
                      activityType: activity.listingtype,
                    };
                    // } else {
                    //   const nft = await prisma.nFT.findUnique({
                    //     where: {
                    //       id: id,
                    //     },
                    //   });
                    // }
                    console.log(off);
                    offersList.push(off);
                  }
                } else {
                  continue;
                }
              }
            }
            await prisma.$disconnect();
            res.status(201).json({
              message: "Successfully received",
              success: true,
              data: offersList,
            });
          } else {
            await prisma.$disconnect();
            res.status(201).json({
              message: "No pending activities!",
              success: true,
              data: [],
            });
          }
        } catch {
          await prisma.$disconnect();
          res
            .status(400)
            .json({ message: "Bad request", success: false, data: [] });
        }
      }
    });
  } else {
    await prisma.$disconnect();
    res
      .status(405)
      .json({ message: "Method not allowed", success: false, data: {} });
  }
};
export default handler;
