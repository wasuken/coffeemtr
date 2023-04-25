import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, User } from "@prisma/client";
import { authUser } from "@/lib/lib";
import { genInputDate } from "@/const";

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
    let year_month = req.query.ym;
    const { gte, lte, yms } = genInputDate(year_month);
    year_month = yms;
    const histList = await prisma.drinkCoffeeHistory.findMany({
      where: {
        createdAt: {
          gte,
          lte,
        },
        userId,
      },
    });
    res.status(200).json(histList);
    return;
  }
}
