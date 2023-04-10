import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const dateList = await prisma.drinkCoffeeHistory.findMany({
      select: {
        createdAt: true,
      },
    });
    if (!dateList) {
      res.status(400).json({ msg: "error" });
      return;
    }
    const ymList = dateList.map((x) => x.createdAt).map((x: Date) => {
      return [x.getFullYear(), x.getMonth() + 1].join("-");
    });
    res.status(200).json([...Array.from(new Set(ymList))]);
    return;
  }
}
