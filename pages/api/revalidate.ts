import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let revalidated = false;
  try {
    await res.unstable_revalidate("/test");
    revalidated = true;
  } catch (error) {
    console.log(error);
  }
  res.json({ message: "success", success: true, data: revalidated });
};
export default handler;
