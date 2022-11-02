import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Offer } from "../../src/interfaces";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { id } = req.body.data;
    try {
      const nft = await prisma.nFT.findUnique({
        where: {
          id: id,
        },
      });

      if (nft) {
        const activity = await prisma.activity.findFirst({
          where: { nftId: nft.id, isExpired: false },
        });
        const offersList: Offer[] = [];
        if (activity) {
          const offers = await prisma.bidding.findMany({
            where: { activityId: activity.id },
          });
          if (offers.length !== 0) {
            for await (const offer of offers) {
              let off: Offer;
              const user = await prisma.user.findUnique({
                where: { id: offer.userId },
              });
              off = {
                id: offer.id,
                price: offer.price,
                usd_price: offer.price,
                floor_diff: "",
                expiration: offer.timestamp.toLocaleDateString(),
                from: user?.userName!,
                
              };

              offersList.push(off);
            }
            //console.log(activityList);
            await prisma.$disconnect();
            res.status(201).json({
              message: "Successfully received",
              success: true,
              data: offersList,
            });
          } else {
            await prisma.$disconnect();
            res.status(201).json({
              message: "No offers yet!",
              success: true,
              data: [],
            });
          }
        } else {
          await prisma.$disconnect();
          res.status(201).json({
            message: "No offers yet!",
            success: true,
            data: [],
          });
        }
      } else {
        await prisma.$disconnect();
        res.status(201).json({
          message: "No matching NFT",
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
  } else {
    await prisma.$disconnect();
    res
      .status(405)
      .json({ message: "Method not allowed", success: false, data: [] });
  }
};
export default handler;
