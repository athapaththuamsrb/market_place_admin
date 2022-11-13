import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { OfferToAccept } from "../../src/interfaces";
import authToken from "../../services/auth.token";
import { ethers } from "ethers";

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
                  let nft;
                  nft = await prisma.nFT.findUnique({
                    where: {
                      id: activity.nftId,
                    },
                  });
                  //   if (id.length === 46) {
                  //     const uri = `https://exclusives.infura-ipfs.io/ipfs/${id}`;
                  //     nft = await prisma.nFT.findUnique({
                  //       where: {
                  //         uri: uri,
                  //       },
                  //     });
                  //   } else {
                  //     nft = await prisma.nFT.findUnique({
                  //       where: {
                  //         id: id,
                  //       },
                  //     });
                  //   }
                  let off: OfferToAccept = {
                    id: offer.id,
                    price: offer.price,
                    nftId: activity.nftId,
                    owner: nft?.ownerId!,
                    expiration: offer.timestamp.toLocaleDateString(),
                    isExpired: offer.isExpired,
                    state: offer.state === "PENDDING" ? "PENDING" : offer.state,
                    isPaid: offer.isPaid,
                  };
                  offersList.push(off);
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
