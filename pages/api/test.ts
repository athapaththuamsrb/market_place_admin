import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // Process a POST request
    const { address, name } = req.body.data;
    try {
      const user = await prisma.user.findUnique({
        where: { walletAddress: address },
      });
      //1st way
      //   if (!user) {
      //     throw new Error("User is not exist");
      //   }

      //2nd way
      if (user) {
      } else {
        res
          .status(401)
          .json({ message: "Unauthorized", success: false, data: [] });
      }
    } catch (error) {
      console.log(error);
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
