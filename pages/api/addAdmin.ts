import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
    const { newAdmin } = req.body;
    try {
      await prisma.user.update({
        where: {
          walletAddress: newAdmin.User_ID,
        },
        data: {
          type: "ADMIN",
        },
      });
    } catch (error) {
      await prisma.$disconnect();
      res
        .status(401)
        .json({ message: "Unauthorized", success: false, data: [] });
    }
    res.status(200).json({ message: "success", success: true, data: [] });
  } else {
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
