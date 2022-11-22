import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { url } = req.body.data;
    let revalidated = false;
    console.log(url);
    try {
      await res.unstable_revalidate(url);
      revalidated = true;
    } catch (error) {
      console.log(error);
    }
    res.json({ message: "success", success: true, data: revalidated });
  } else {
    res.json({ message: "success", success: true, data: false });
  }
};
export default handler;
