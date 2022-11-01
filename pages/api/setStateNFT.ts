//TODO pendding
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { action, value, id } = req.body.data;
    let msg: string;
    try {
      switch (action) {
        case "listed":
          const oldNFT = await prisma.nFT.findFirst({
            where: {
              id: id,
            },
          });

          if (oldNFT) {
            const owner = await prisma.owner.findUnique({
              where: { id: oldNFT.ownerId },
            });
            if (!owner) throw new Error("owner is not exist");
            const user = await prisma.user.findUnique({
              where: { walletAddress: owner.walletAddress },
            });
            if (!user) throw new Error("user is not exist");
            if (value) {
              const saleWay = req.body.data.saleWay;

              if (saleWay !== "FIXED_PRICE" && saleWay !== "TIMED_AUCTION")
                throw new Error("Sale way is not exist");
              const price = req.body.data.price;
              const signature = req.body.data.signature;
              await prisma.activity.create({
                data: {
                  nftId: oldNFT.id,
                  listingtype: saleWay,
                  endDate: req.body.data.endDate,
                  sellingprice: price,
                  signature: signature,
                  userId: user.id,
                },
              });
            } else {
              const activity = await prisma.activity.findFirst({
                where: { nftId: oldNFT.id, isExpired: false },
              });
              if (activity) {
                await prisma.activity.update({
                  where: { id: activity.id },
                  data: { isExpired: true },
                });
              } else {
                throw new Error("activity is not exist");
              }
            }
          } else {
            throw new Error("nft id is not exist");
          }
          msg = "update as listed";
          break;
        case "sold":
          const userData = { walletAddress: req.body.data.buyerWalletAddress };
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
          const oldNFT1 = await prisma.nFT.findFirst({
            where: {
              id: id,
              isMinted: false,
            },
          });
          if (oldNFT1 && value) {
            const activity = await prisma.activity.findFirst({
              where: { nftId: oldNFT1.id, isExpired: false },
            });
            if (activity) {
              if (activity.listingtype === "FIXED_PRICE") {
                const price = req.body.data.price;
                const time = req.body.data.time;
                await prisma.activity.update({
                  where: {
                    id: oldNFT1.id,
                  },
                  data: {
                    isExpired: true,
                    buyerId: owner.id,
                    buyingprice: price,
                    buyingTimestamp: time,
                  },
                });
                await prisma.nFT.update({
                  where: {
                    id: oldNFT1.id,
                  },
                  data: {
                    isMinted: true,
                    ownerId: owner.id,
                  },
                });
              } else if (activity.listingtype == "TIMED_AUCTION") {
                //Biding selling noraml
              } else {
                throw new Error("the listing type is not exist");
              }
            } else {
              throw new Error("activity is not exist");
            }
          } else {
            throw new Error("nft id is not exist");
          }
          msg = "update sold";
          break;
        default:
          msg = "feild is wrong";
      }
      await prisma.$disconnect();

      res.status(201).json({ message: msg, success: true, data: {} });
    } catch (error) {
      await prisma.$disconnect();
      res
        .status(400)
        .json({ message: "Bad request", success: false, data: {} });
    }
  } else {
    await prisma.$disconnect();
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: {} });
  }
};
export default handler;
