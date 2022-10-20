import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { filed, value, id, price } = req.body.data;
    let msg: string;
    //console.log(req.body.data);
    try {
      switch (filed) {
        case "listed":
          const oldNFT = await prisma.nFT.findFirst({
            where: {
              id: id,
              isMinted: false,
            },
          });
          //console.log(oldNFT);
          if (oldNFT) {
            if (value) {
              const sale_way = req.body.data.saleWay;
              await prisma.activity.create({
                data: {
                  nftId: oldNFT.id,
                  listingtype: sale_way,
                  endDate: req.body.data.endDate,
                  sellingprice: price,
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
          const userData = { walletAddress: req.body.data.buyer };
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
                //Fixed price selling noraml
                await prisma.activity.update({
                  where: {
                    id: oldNFT1.id,
                  },
                  data: {
                    isExpired: true,
                    buyerId: owner.id,
                    buyingprice: price,
                    buyingTimestamp: new Date(),
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
