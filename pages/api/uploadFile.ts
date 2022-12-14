//TODO DONE
import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import authToken from "../../services/auth.token";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const body = req.body.data;
    const token = req.body.data.token;
    await authToken.userAuthToken(token).then(async (address) => {
      if (ethers.utils.isAddress(address!) && typeof address == "string") {
        try {
          const user = await prisma.user.findUnique({
            where: { walletAddress: address },
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
                    creatorId: user.id,
                    collectionName: body.collectionName,
                    collectionAddress: body.collectionAddress,
                    collectionDescription: body.collectionDescription,
                    featuredImage: body.featuredImageURL,
                    logoImage: body.logoImageURL,
                    bannerImage: body.bannerImageURL,
                    collectionCategory: body.collectionCategory,
                  },
                });

                break;
              default:
                throw new Error("not exit folder");
            }

            await prisma.$disconnect();
            res
              .status(201)
              .json({ message: "Successfully added", success: true });
          } else {
            await prisma.$disconnect();
            res
              .status(401)
              .json({ message: "unauthorized", success: false, data: [] });
          }
        } catch (error) {
          console.log(error);
          await prisma.$disconnect();
          res.status(401).json({ message: "unauthorized", success: false });
        }
      } else {
        res
          .status(401)
          .json({ message: "Unauthorized", success: false, data: [] });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed", success: false });
  }
};
export default handler;
