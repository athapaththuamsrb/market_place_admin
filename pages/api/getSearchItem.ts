import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { query } = req.body.data;
    try {
      const collection = await prisma.collection.findFirst({
        where: { collectionName: query },
      });
      if (collection) {
        if (collection.status === "BLOCKED") {
          res.status(400).json({
            message: "Collection is blocked",
            success: false,
            data: "",
          });
        }
        res.status(201).json({
          message: "Successfully get",
          success: true,
          data: collection.id,
        });
      } else {
        res.status(200).json({
          message: "Collection does not exist",
          success: false,
          data: "",
        });
      }
    } catch (error) {
      await prisma.$disconnect();
      res.status(400).json({
        message: "Collection does not exist",
        success: false,
        data: "",
      });
    }
  } else {
    res
      .status(405)
      .json({ message: "Method not allowed", success: false, data: "" });
  }
};
export default handler;