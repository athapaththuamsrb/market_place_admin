import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Activity, NFT_load } from "../../src/interfaces";
import axios from "axios";
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
      //check if the NFT is there or not
      if (nft) {
        const activities = await prisma.activity.findMany({
          where: { nftId: nft.id },
        });
        const activityList: Activity[] = [];
        //if there's any activity
        if (activities.length !== 0) {
          const owner = await prisma.owner.findUnique({
            where: { id: nft.ownerId },
          });
          const user = await prisma.user.findUnique({
            where: { id: owner?.userId },
          });
          let act: Activity = {
            event: "Minted",
            price: "",
            from: "Null Address",
            to: user?.userName!,
            date: nft.timestamp.toDateString(),
          };
          activityList.push(act);
          for await (const activity of activities) {
            let act1: Activity;
            let act2: Activity;
            if (activity.buyingprice !== null) {
              const buyer = await prisma.user.findFirst({
                where: { id: activity.buyerId! },
              });
              act1 = {
                event: "Sale",
                price: activity.buyingprice,
                from: activity.buyerId!,
                to: buyer?.userName!,
                date: activity.buyingTimestamp.toString()!,
              };
              activityList.push(act1);
              act2 = {
                event: "Transfer",
                price: "",
                from: activity.buyerId!,
                to: buyer?.userName!,
                date: activity.buyingTimestamp.toString()!,
              };
              activityList.push(act2);
            } else {
              act1 = {
                event: "List",
                price: activity.sellingprice,
                from: "Check", //TODO
                to: "",
                date: activity.listingTimestamp.toString()!,
              };
              activityList.push(act1);
            }
          }
        } else {
          const owner = await prisma.owner.findUnique({
            where: { id: nft.ownerId },
          });
          const user = await prisma.user.findUnique({
            where: { id: owner?.userId },
          });
          let act: Activity = {
            event: "Minted",
            price: "",
            from: "Null Address",
            to: user?.userName!,
            date: nft.timestamp.toDateString(),
          };
          activityList.push(act);
        }
        //console.log(activityList);
        await prisma.$disconnect();
        res.status(201).json({
          message: "Successfully received",
          success: true,
          data: activityList,
        });
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