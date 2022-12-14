import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Report } from "../../src/interfaces";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const reportedId = req.body.data;
    const action = req.body.action;
    const type = req.body.type;
    const reported = await prisma.report.findFirst({
      where: {
        reportedId: reportedId.id,
      },
    });
    try {
      if (action == "block") {
        await prisma.report.update({
          where: {
            id: reported?.id,
          },
          data: {
            STATUS: "BLOCKED",
          },
        });
        if (type == "NFT") {
          await prisma.nFT.update({
            where: {
              id: reportedId.id,
            },
            data: {
              status: "BLOCKED",
            },
          });
        }
        if (type == "Collection") {
          await prisma.collection.update({
            where: {
              id: reportedId.id,
            },
            data: {
              status: "BLOCKED",
            },
          });
        }
        if (type == "User") {
          await prisma.user.update({
            where: {
              id: reportedId.id,
            },
            data: {
              status: "BLOCKED",
            },
          });
        }
      } else if (action == "verify") {
        await prisma.report.update({
          where: {
            id: reported?.id,
          },
          data: {
            STATUS: "ACTIVE",
          },
        });
        if (type == "NFT") {
          await prisma.nFT.update({
            where: {
              id: reportedId.id,
            },
            data: {
              status: "ACTIVE",
            },
          });
        }
        if (type == "Collection") {
          await prisma.collection.update({
            where: {
              id: reportedId.id,
            },
            data: {
              status: "ACTIVE",
            },
          });
        }
        if (type == "User") {
          await prisma.user.update({
            where: {
              id: reportedId.id,
            },
            data: {
              status: "ACTIVE",
            },
          });
        }
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
