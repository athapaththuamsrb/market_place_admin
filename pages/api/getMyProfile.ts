//TODO DONE
const jwt = require("jsonwebtoken");
import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import { Profile } from "./../../src/interfaces";
import getConfig from "next/config";
const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (ethers.utils.isAddress(req.body.data.address)) {
      const userData = {
        walletAddress: req.body.data.address,
      };
      try {
        let user = await prisma.user.findUnique({
          where: userData,
        });
        if (!user) {
          user = await prisma.user.create({
            data: userData,
          });
        }
        if (user.status == "ACTIVE" || user.status == "REPORTED") {
          const profile: Profile = {
            bannerImage: user.bannerImage,
            profileImage: user.profileImage,
            userName: user.userName,
            walletAddress: user.walletAddress,
          };

          // create a jwt token that is valid for 2 days
          const token: String = jwt.sign(
            { walletAddress: user.walletAddress, type: user.type },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "2d",
            }
          );

          res.status(201).json({
            message: "Successfully get",
            success: true,
            data: profile,
            token: token,
          });
        } else {
          await prisma.$disconnect();
          res
            .status(401)
            .json({ message: "unauthorized", success: false, data: [] });
        }
      } catch (error) {
        await prisma.$disconnect();
        res
          .status(401)
          .json({ message: "Unauthorized", success: false, data: [] });
      }
    } else {
      res
        .status(401)
        .json({ message: "Unauthorized", success: false, data: [] });
    }
  } else {
    await prisma.$disconnect();
    res
      .status(405)
      .json({ message: "Method not allowed", success: false, data: [] });
  }
};
export default handler;
