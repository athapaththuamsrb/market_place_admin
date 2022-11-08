import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Offer } from "../../src/interfaces";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { id } = req.body.data;
    try {
      const offer = await prisma.bidding.findUnique({
        where: {
          id: id,
        },
      });
      //console.log("dcnjh")
      if (offer) {
        const activity = await prisma.activity.findFirst({
          where: {
            id: offer.activityId,
          },
        });
        if (!activity?.isPenddingPayment) {
          await prisma.bidding.update({
            where: { id: id },
            data: { state: "ACCEPTED" },
          });
          await prisma.activity.update({
            where: { id: offer.activityId },
            data: { isPenddingPayment: true },
          });
          console.log(offer);
          await prisma.$disconnect();
          res
            .status(201)
            .json({ message: "Successfully done!", success: true });
        } else {
          await prisma.$disconnect();
          res.status(403).json({
            message: "Activity already accepted!",
            success: false,
            data: [],
          });
        }
      } else {
        await prisma.$disconnect();
        res.status(403).json({
          message: "No offer found!",
          success: false,
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
