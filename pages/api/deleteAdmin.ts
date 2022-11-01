import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Report } from "../../src/interfaces";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const userId = req.body.data;
    console.log(userId.id);
    try {
      await prisma.user.update({
        data: {
          type: "USER",
        },
        where: {
          id: userId.id,
        },
      });
      //console.log(report_);
      /*console.log(report);
      if (report) {
        report.STATUS = "BLOCKED";
        res.status(201).json({
          message: "Successfully received",
          success: true,
          data: "output",
        });
        console.log(report);
      } else {
        res
          .status(401)
          .json({ message: "Unauthorized", success: false, data: [] });
      }*/
    } catch (error) {
      console.log(error);
      await prisma.$disconnect();
      res.status(401).json({ message: "error", success: false, data: [] });
    }
    res.status(200).json({ message: "success", success: true, data: [] });
  } else {
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
