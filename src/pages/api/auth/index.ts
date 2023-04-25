import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@prisma/client";
import { authUser } from "@/lib/lib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const user: User | null = await authUser(req.headers.authorization);
    if (!user) {
      res.status(401).json({ msg: "unauthorized." });
      return;
    }
    if (!user) {
      res.status(401).json({ msg: "unauthorized." });
      return;
    }
    return res.status(200).json({});
  }
}
