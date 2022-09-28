import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Profile } from "./../../src/interfaces";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const userData = {
      walletAddress: req.body.data.address,
    };
    try {
      let user = await prisma.user.findUnique({
        where: userData,
      });
      if (user) {
        const profile: Profile = {
          bannerImage: user.bannerImage,
          profileImage: user.profileImage,
          type: user.type,
          userName: user.userName,
          walletAddress: user.walletAddress,
        };
        res
          .status(201)
          .json({ message: "successfully get", success: true, data: profile });
      } else {
        throw new Error("User is not exit");
      }
    } catch (error) {
      await prisma.$disconnect();
      res
        .status(400)
        .json({ message: "User is not exit", success: false, data: [] });
    }
  } else {
    await prisma.$disconnect();
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
