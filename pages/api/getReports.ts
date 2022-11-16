import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Report } from "../../src/interfaces";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    // Process a POST request
    // const { address, name } = req.body.data;
    try {
      const reports = await prisma.report.findMany({
        where: {
          STATUS: "REPORTED",
        },
      });
      let results: Report[] = [];
      for (const report_data of reports) {
        const reporter_name = await prisma.user.findUnique({
          where: {
            id: report_data.reporterId,
          },
        });
        const owner = await prisma.nFT.findFirst({
          where: {
            id: report_data.reportedId,
          },
        });
        results.push({
          id: report_data.id,
          reportedId: report_data.reportedId,
          reportedOwner: owner?.ownerId,
          reportType: report_data.reportType,
          reporterId: report_data.reporterId,
          reporter: reporter_name?.userName,
          reason: report_data.reason,
          DateTime: report_data.DateTime,
          STATUS: report_data.STATUS,
        });
      }
      res.status(201).json({
        message: "Successfully received",
        success: true,
        data: results,
      });
      /*if (user) {
      } else {
        res
          .status(401)
          .json({ message: "Unauthorized", success: false, data: [] });
      }*/
    } catch (error) {
      console.log(error);
      await prisma.$disconnect();
      res.status(401).json({ message: error, success: false, data: [] });
    }
    //res.status(200).json({ message: "success", success: true, data: [] });
  } else {
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
