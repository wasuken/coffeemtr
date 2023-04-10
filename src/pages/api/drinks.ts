import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // 一覧の取得
    let where: Prisma.DrinkCoffeeHistoryWhereInput = {};
    if (req.query) {
      const { begin, end } = req.query;

      if (typeof begin === "string" || typeof end === "string") {
        where.createdAt = {};
        if (typeof begin === "string") {
          where.createdAt.gte = new Date(begin);
        }
        if (typeof end === "string") {
          where.createdAt.lte = new Date(end);
        }
      }
    }
    const drinkHistory = await prisma.drinkCoffeeHistory.findMany({
	  where
	});
    res.status(200).json(drinkHistory);
  }
  return;
}
