import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const body = req.body.data;
    try {
      const user = await prisma.user.findUnique({
        where: { walletAddress: body.userwalletAddress },
      });
      if (user) {
        switch (body.folder) {
          case "profile":
            await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                userName: body.userName,
                bannerImage: body.bannerImageURL,
                profileImage: body.profileImageURL,
              },
            });
            break;
          case "collection":
            await prisma.collection.create({
              data: {
                userId: user.id,
                name: body.collectionName,
                address: body.collectionAddress,
                featuredImage: body.featuredImageURL,
                logoImage: body.logoImageURL,
                bannerImage: body.bannerImageURL,
              },
            });
            break;
          default:
            throw new Error("not exit folder");
        }

        await prisma.$disconnect();
        res.status(201).json({ message: "Successfully added", success: true });
      }
    } catch {
      await prisma.$disconnect();
      res.status(400).json({ message: "Bad request", success: false });
    }
  } else {
    res.status(405).json({ message: "Method not allowed", success: false });
  }
};
export default handler;
