import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Activity } from "../../src/interfaces";
import axios from "axios";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { id, creatorUserId } = req.body.data;
    try {
      let nft;
      if (id.length === 46) {
        const uri = `https://exclusives.infura-ipfs.io/ipfs/${id}`;
        nft = await prisma.nFT.findUnique({
          where: {
            uri: uri,
          },
        });
      } else {
        nft = await prisma.nFT.findUnique({
          where: {
            id: id,
          },
        });
      }
      //check if the NFT is there or not
      if (nft) {
        const activities = await prisma.activity.findMany({
          where: { nftId: nft.id },
        });
        //console.log(activities);
        const activityList: Activity[] = [];
        const creator = await prisma.user.findUnique({
          where: { id: creatorUserId },
        });
        //if there's any activity
        if (activities.length !== 0) {
          const owner = await prisma.owner.findUnique({
            where: { id: nft.ownerId },
          });
          const user = await prisma.user.findUnique({
            where: { id: owner?.userId },
          });
          let act: Activity = {
            id: user?.id!,
            event: "Minted",
            price: "",
            from: "Null Address",
            fromID: "",
            to: creator?.userName!,
            toID: creator?.id!,
            date: nft.timestamp.toLocaleString(),
          };
          activityList.push(act);
          for await (const activity of activities) {
            let act1: Activity;
            let act2: Activity;
            const seller = await prisma.user.findFirst({
              where: { id: activity.userId! },
            });
            if (activity.buyingprice !== null) {
              const buyerOwner = await prisma.owner.findFirst({
                where: { id: activity.buyerId! },
              });
              const buyer = await prisma.user.findFirst({
                where: { id: buyerOwner?.userId },
              });
              const endDate = new Date(Number(activity.buyingTimestamp!));
              act1 = {
                id: activity.id,
                event: "Sale",
                price: activity.buyingprice,
                from: seller?.userName!,
                fromID: seller?.id!,
                to: buyer?.userName!,
                toID: buyer?.id!,
                date: endDate.toLocaleString(),
              };
              activityList.push(act1);
              act2 = {
                id: activity.id + "Transfer",
                event: "Transfer",
                price: "",
                from: seller?.userName!,
                fromID: seller?.id!,
                to: buyer?.userName!,
                toID: buyer?.id!,
                date: endDate.toLocaleString(),
              };
              activityList.push(act2);
            } else {
              act1 = {
                id: activity.id,
                event: "List",
                price: activity.sellingprice,
                from: seller?.userName!,
                fromID: seller?.id!,
                to: "",
                toID: "",
                date: activity.listingTimestamp.toLocaleString()!,
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
            id: user?.id!,
            event: "Minted",
            price: "",
            from: "Null Address",
            fromID: "",
            to: creator?.userName!,
            toID: creator?.id!,
            date: nft.timestamp.toLocaleString(),
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
