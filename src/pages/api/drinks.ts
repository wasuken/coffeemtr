import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const defaultParams = {
  begin: "1970-01-01",
  end: "2100-12-31",
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // 一覧の取得
    let where = {};
    if (req.params) {
      where = {
        where: {
          createdAt: {
            // gte: dtb,
            // lte: dte,
          },
        },
      };
      const { begin, end } = { ...req.params, defaultParams };
      const dtb = new Date(begin);
      const dte = new Date(end);
      if (req.params.begin) {
        where.where.createdAt.gte = dtb;
      }
      if (req.params.end) {
        where.where.createdAt.lte = dte;
      }
    }
    const drinkHistory = await prisma.drinkCoffeeHistory.findMany(where);
    res.status(200).json(drinkHistory);
  }
  return;
}
