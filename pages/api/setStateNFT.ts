//TODO pendding
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import authToken from "../../services/auth.token";
import { ethers } from "ethers";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { action, value, id, token } = req.body.data;
    let msg: string;
    await authToken.userAuthToken(token).then(async (address) => {
      if (ethers.utils.isAddress(address!) && typeof address == "string") {
        try {
          const user = await prisma.user.findUnique({
            where: { walletAddress: address },
          });
          if (!user) throw new Error("user is not exist");
          let owner = await prisma.owner.findUnique({
            where: { walletAddress: address },
          });
          if (!owner)
            owner = await prisma.owner.create({
              data: { walletAddress: address, userId: user.id },
            });

          switch (action) {
            case "listed":
              const oldNFT = await prisma.nFT.findFirst({
                where: {
                  id: id,
                  ownerId: owner.id,
                  isMinted: false,
                },
              });
              console.log(oldNFT)
              if (oldNFT) {
                if (oldNFT.ownerId !== owner.id)
                  throw new Error("nft ower is wrong");
                if (value) {
                  const saleWay = req.body.data.saleWay;

                  if (saleWay !== "FIXED_PRICE" && saleWay !== "TIMED_AUCTION")
                    throw new Error("Sale way is not exist");
                  const price = req.body.data.price;
                  const signature = req.body.data.signature;
                  await prisma.activity.create({
                    data: {
                      nftId: oldNFT.id,
                      listingtype: saleWay,
                      endDate: req.body.data.endDate,
                      sellingprice: price,
                      signature: signature,
                      userId: user.id,
                    },
                  });

                  //get NFTs in particular collection
                  const nfts = await prisma.nFT.findMany({
                    where: {
                      collectionId: oldNFT.collectionId,
                    },
                  });
                  let buyings: number[] = [];
                  var floor_price: number = 0;
                  //find floor  price from all nfts in the updated collection
                  for (let nft of nfts) {
                    await prisma.activity
                      .findFirst({
                        where: {
                          nftId: nft.id,
                          isExpired: false,
                        },
                      })
                      .then((data) => {
                        if (data?.sellingprice) {
                          buyings.push(Number(data?.sellingprice));
                        }
                        floor_price = Math.min.apply(null, buyings);
                      });
                  }
                  //update floor price
                  await prisma.collection.update({
                    where: {
                      id: oldNFT.collectionId,
                    },
                    data: {
                      floorPrice: String(floor_price),
                    },
                  });
                } else {
                  const activity = await prisma.activity.findFirst({
                    where: { nftId: oldNFT.id, isExpired: false },
                  });
                  if (activity) {
                    await prisma.activity.update({
                      where: { id: activity.id },
                      data: { isExpired: true, isPenddingPayment: false },
                    });

                    //get NFTs in particular collection
                    const nfts = await prisma.nFT.findMany({
                      where: {
                        collectionId: oldNFT.collectionId,
                      },
                    });
                    let buyings: number[] = [];
                    var floor_price: number = 0;
                    //find floor  price from all nfts in the updated collection
                    for (let nft of nfts) {
                      await prisma.activity
                        .findFirst({
                          where: {
                            nftId: nft.id,
                            isExpired: false,
                          },
                        })
                        .then((data) => {
                          if (data?.sellingprice) {
                            buyings.push(Number(data?.sellingprice));
                          }
                          floor_price = Math.min.apply(null, buyings);
                        });
                    }
                    //update floor price
                    await prisma.collection.update({
                      where: {
                        id: oldNFT.collectionId,
                      },
                      data: {
                        floorPrice: String(floor_price),
                      },
                    });
                  } else {
                    throw new Error("activity is not exist");
                  }
                }
              } else {
                throw new Error("nft id is not exist");
              }
              msg = "update as listed";
              break;
            case "sold":
              console.log(id, owner.id, false);
              const oldNFT1 = await prisma.nFT.findFirst({
                where: {
                  id: id,
                  isMinted: false,
                },
              });
              if (oldNFT1 && value) {
                const activity = await prisma.activity.findFirst({
                  where: { nftId: oldNFT1.id, isExpired: false },
                });
                if (activity) {
                  if (activity.listingtype === "FIXED_PRICE") {
                    const price = req.body.data.price;
                    if (price != activity.sellingprice)
                      throw new Error("Uncompatible price");
                    const time = req.body.data.time;
                    //update activity table
                    await prisma.activity.update({
                      where: {
                        id: activity.id,
                      },
                      data: {
                        isExpired: true,
                        buyerId: owner.id,
                        buyingprice: price,
                        buyingTimestamp: time,
                        isPenddingPayment: false,
                      },
                    });
                    const nft = await prisma.nFT.findUnique({
                      where: { id: id },
                    });
                    //set collection volume
                    const pre_volume = await prisma.collection.findUnique({
                      where: {
                        id: nft?.collectionId,
                      },
                    });
                    await prisma.collection.update({
                      where: {
                        id: nft?.collectionId,
                      },
                      data: {
                        totalVolume: String(
                          Number(pre_volume?.totalVolume) + Number(price)
                        ),
                      },
                    });

                    //update nft table
                    await prisma.nFT.update({
                      where: {
                        id: oldNFT1.id,
                      },
                      data: {
                        isMinted: true,
                        ownerId: owner.id,
                      },
                    });
                  } else {
                    throw new Error("the listing type is not exist");
                  }
                } else {
                  throw new Error("activity is not exist");
                }
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
        res
          .status(401)
          .json({ message: "Unauthorized", success: false, data: {} });
      }
    });
  } else {
    await prisma.$disconnect();
    res
      .status(405)
      .json({ message: "Method not allowed", success: false, data: {} });
  }
};
export default handler;
