import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Report } from "../../src/interfaces";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const userId = req.body.data;
    const action = req.body.action;
    const user = await prisma.report.findFirst({
      where: {
        reportedId: userId.id,
      },
    });
    try {
      if (action == "block") {
        await prisma.report.update({
          where: {
            id: user?.id,
          },
          data: {
            STATUS: "BLOCKED",
          },
        });
        await prisma.user.update({
          where: {
            id: userId.id,
          },
          data: {
            status: "BLOCKED",
          },
        });
      } else if (action == "verify") {
        await prisma.report.update({
          where: {
            id: user?.id,
          },
          data: {
            STATUS: "ACTIVE",
          },
        });
        await prisma.user.update({
          where: {
            id: userId.id,
          },
          data: {
            status: "ACTIVE",
          },
        });
      }
    } catch (error) {
      console.log(error);
      await prisma.$disconnect();
      res.status(401).json({ message: error, success: false, data: [] });
    }
    res.status(200).json({ message: "success", success: true, data: [] });
  } else {
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
