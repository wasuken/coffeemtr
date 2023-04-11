import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import { genInputDate } from "@/const";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    let year_month = req.query.ym;
	console.log(year_month)
    const { gte, lte, yms } = genInputDate(year_month);
    year_month = yms;
    const histList = await prisma.drinkCoffeeHistory.findMany({
      where: {
        createdAt: {
          gte,
          lte,
        },
      },
    });
    res.status(200).json(histList);
    return;
  }
}
