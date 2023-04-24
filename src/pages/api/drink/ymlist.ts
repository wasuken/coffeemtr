import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, User } from "@prisma/client";
import { authUser } from "@/lib/lib";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user: User | null = await authUser(req.headers.authorization);
  if (!user) {
    res.status(401).json({ msg: "unauthorized." });
    return;
  }
  const userId = user.id;
  if (req.method === "GET") {
    const dateList = await prisma.drinkCoffeeHistory.findMany({
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      where: {
        userId,
      },
    });
    if (!dateList) {
      res.status(400).json({ msg: "error" });
      return;
    }
    const ymList = dateList
      .map((x) => x.createdAt)
      .map((x: Date) => {
        return [x.getFullYear(), x.getMonth() + 1].join("-");
      });
    res.status(200).json([...Array.from(new Set(ymList))]);
    return;
  }
}
