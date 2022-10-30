import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { User } from "../../src/interfaces";
import { date } from "yup";
import NFTCard from "../../components/ui/NFT/NFTCard";
import axios from "axios";
import api from "../../lib/api";
import { TodayOutlined } from "@mui/icons-material";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    // Process a POST request
    // const { address, name } = req.body.data;
    try {
      const user = await prisma.user.findMany({
        /*where: {
          type: "USER",
        },*/
      });
      let results: User[] = [];
      for (const user_data of user) {
        /*let reporter_name = await prisma.owner.findUnique({
          where: {
            walletAddress: user_data.walletAddress,
          },
        });
        console.log("This line to be executed" + reporter_name?.userId);*/
        //TODO:get NFT statistics
        /*const { data } = await api.post("/api/getUser", {
          data: { userId: user_data.id },
        });*/
        //console.log(data.data);
        results.push({
          id: user_data.id,
          User_ID: user_data.walletAddress,
          Name: user_data.userName,
          Total: await prisma.nFT.count({
            //where: NFT.
          }),
          Created: 1,
          Volume: 1,
          Status: user_data.status,
          Type: user_data.type,
          reportType: "",
          reportedBy: "",
          //reportedDate: null,
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
    res.status(200).json({ message: "success", success: true, data: [] });
  } else {
    res
      .status(405)
      .json({ message: "Method not alloed", success: false, data: [] });
  }
};
export default handler;
