import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import authToken from "../../services/auth.token";
const prisma = new PrismaClient();
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // Process a POST request
    const { id, token, price, time } = req.body.data;
    await authToken.userAuthToken(token).then(async (address) => {
      if (ethers.utils.isAddress(address!) && typeof address == "string") {
        try {
          const user = await prisma.user.findUnique({
            where: { walletAddress: address },
          });
          if (user) {
            let owner = await prisma.owner.findUnique({
              where: { walletAddress: address },
            });
            if (!owner) {
              owner = await prisma.owner.create({
                data: { walletAddress: address, userId: user.id },
              });
            }
            const nft = await prisma.nFT.findUnique({ where: { id: id } });
            if (!nft) throw new Error("nft is not exist");
            const activity = await prisma.activity.findFirst({
              where: { nftId: id, isPenddingPayment: true },
            });
            if (!activity) throw new Error("activity is not exist");
            const bidding = await prisma.bidding.findFirst({
              where: {
                activityId: activity.id,
                isExpired: false,
                userId: user.id,
              },
            });
            if (!bidding) throw new Error("bidding is not exist");
            if (price != bidding.price) throw new Error("Uncompatible price");
            //update bidding table
            await prisma.bidding.update({
              where: { id: bidding.id },
              data: { isPaid: true, isExpired: true },
            });
            await prisma.bidding.updateMany({
              where: { activityId: activity.id, NOT: { id: bidding.id } },
              data: { isExpired: true },
            });
            //update activity table
            await prisma.activity.update({
              where: { id: activity.id },
              data: {
                isPenddingPayment: false,
                isExpired: true,
                buyerId: owner.id,
                buyingprice: price,
                buyingTimestamp: time,
              },
            });
            //set collection volume
            const pre_volume = await prisma.collection.findUnique({
              where: {
                id: nft.collectionId,
              },
            });
            await prisma.collection.update({
              where: {
                id: nft.collectionId,
              },
              data: {
                totalVolume: String(
                  Number(pre_volume?.totalVolume) + Number(price)
                ),
              },
            });

            //update nft table
            await prisma.nFT.update({
              where: {
                id: nft.id,
              },
              data: {
                isMinted: true,
                ownerId: owner.id,
              },
            });
            await prisma.$disconnect();
            res
              .status(201)
              .json({ message: "Successfully done", success: true });
          } else {
            await prisma.$disconnect();
            res.status(401).json({ message: "unauthorized", success: false });
          }
        } catch (error) {
          console.log(error);
          await prisma.$disconnect();
          res.status(401).json({ message: "unauthorized", success: false });
        }
      } else {
        res.status(401).json({ message: "Unauthorized", success: false });
      }
    });
  } else {
    res.status(405).json({ message: "Method not alloed", success: false });
  }
};
export default handler;
