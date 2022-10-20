//TODO DONE
import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import { Profile } from "./../../src/interfaces";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (ethers.utils.isAddress(req.body.data.address)) {
      const userData = {
        walletAddress: req.body.data.address,
      };
      try {
        let user = await prisma.user.findUnique({
          where: userData,
        });
        if (!user) {
          user = await prisma.user.create({
            data: userData,
          });
        }
        if (user.status == "ACTIVE" || user.status == "REPORTED") {
          const profile: Profile = {
            bannerImage: user.bannerImage,
            profileImage: user.profileImage,
            type: user.type,
            userName: user.userName,
            walletAddress: user.walletAddress,
          };
          res.status(201).json({
            message: "Successfully get",
            success: true,
            data: profile,
          });
        } else {
          await prisma.$disconnect();
          res
            .status(401)
            .json({ message: "unauthorized", success: false, data: [] });
        }
      } catch (error) {
        await prisma.$disconnect();
        res
          .status(401)
          .json({ message: "unauthorized", success: false, data: [] });
      }
    } else {
      res
        .status(401)
        .json({ message: "unauthorized", success: false, data: [] });
    }
  } else {
    await prisma.$disconnect();
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
