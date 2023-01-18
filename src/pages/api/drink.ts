import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import { COFFEE_CAFFEINE } from "@/const";

const prisma = new PrismaClient();

const defaultParam = {
  mg: COFFEE_CAFFEINE,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { mg } = { ...defaultParam, ...req.body };
    await prisma.drinkCoffeeHistory.create({
      data: {
        caffeine_contents_mg: mg,
      },
    });
    res.status(200).json({ msg: "success" });
  } else if (req.method === "GET") {
    // const dt = new Date();
    // const df = [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join("-");
    const drinkHistory = await prisma.drinkCoffeeHistory.findMany();
    res.status(200).json(drinkHistory);
  }
  return;
}
