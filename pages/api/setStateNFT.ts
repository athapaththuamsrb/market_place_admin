import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { filed, value, id, price } = req.body.data;
    let msg: string;
    //console.log(req.body.data);
    try {
      switch (filed) {
        case "listed":
          const royality = Number(req.body.data.royality);
          const oldNFT = await prisma.nFT.findFirst({
            where: {
              id: id,
              isDelete: false,
            },
          });

          if (oldNFT) {
            if (value) {
              await prisma.nFT.create({
                data: {
                  category: oldNFT.category,
                  collection: oldNFT.collection,
                  creatorId: oldNFT.creatorId,
                  ownerId: oldNFT.ownerId,
                  price: price,
                  tokenID: oldNFT.tokenID,
                  uri: oldNFT.uri,
                  signature: req.body.data.signature,
                  description: oldNFT.description,
                  image: oldNFT.image,
                  name: oldNFT.name,
                  listed: true,
                  royality: royality,
                },
              });
              await prisma.nFT.update({
                where: {
                  id: id,
                },
                data: {
                  isDelete: true,
                },
              });
            } else {
              await prisma.nFT.update({
                where: {
                  id: id,
                },
                data: {
                  listed: false,
                  price: "0",
                  royality: 0,
                },
              });
            }
          } else {
            throw new Error("nft id is not exist");
          }
          msg = "update listed";
          break;
        case "sold":
          const oldNFT1 = await prisma.nFT.findFirst({
            where: {
              id: id,
              isDelete: false,
              listed: true,
            },
          });
          if (oldNFT1 && value) {
            await prisma.nFT.create({
              data: {
                category: oldNFT1.category,
                collection: oldNFT1.collection,
                creatorId: oldNFT1.creatorId,
                ownerId: oldNFT1.ownerId,
                price: oldNFT1.price,
                tokenID: oldNFT1.tokenID,
                uri: oldNFT1.uri,
                signature: oldNFT1.signature,
                description: oldNFT1.description,
                image: oldNFT1.image,
                name: oldNFT1.name,
                sold: true,
                listed: false,
                royality: oldNFT1.royality,
              },
            });
            await prisma.nFT.update({
              where: {
                id: id,
              },
              data: {
                isDelete: true,
              },
            });
          } else {
            throw new Error("nft id is not exist");
          }
          msg = "update sold";
          break;
        default:
          msg = "feild is wrong";
      }
      await prisma.$disconnect();

      res.status(201).json({ message: msg, success: true, data: {} });
    } catch (error) {
      await prisma.$disconnect();
      res
        .status(400)
        .json({ message: "Bad request", success: false, data: {} });
    }
  } else {
    await prisma.$disconnect();
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: {} });
  }
};
export default handler;