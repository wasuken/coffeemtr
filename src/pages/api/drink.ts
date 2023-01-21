import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import { COFFEE_CAFFEINE } from "@/const";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const defaultParam = {
      mg: COFFEE_CAFFEINE,
    };
    const { mg } = { ...defaultParam, ...req.body };
    await prisma.drinkCoffeeHistory.create({
      data: {
        caffeine_contents_mg: mg,
      },
    });
    res.status(200).json({ msg: "success" });
  } else if (req.method === "GET") {
    const dt = new Date();
    const df = [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join("-");
    const dfb = `${df} 00:00:00`
    const dfe = `${df} 23:59:59`
    const drinkHistory = await prisma.drinkCoffeeHistory.findMany({
      where: {
        createdAt: {
          gte: new Date(dfb),
          lte: new Date(dfe),
        }
      }
    });
    res.status(200).json(drinkHistory);
  } else if (req.method === "DELETE") {
    const defaultParam = {
      date: new Date(),
    };
    const { date } = { ...req.params, ...defaultParam };
    const latestDrinkInDate = await prisma.drinkCoffeeHistory.findFirst({
      where: {
        AND: [
          {
            createdAt: {
              gte: date,
            },
            createdAt: {
              lte: date,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log("debug", latestDrinkInDate);
    if (latestDrinkInDate !== null) {
      // 削除対象があるので、削除処理を行う
      await prisma.drinkCoffeeHistory.delete({
        where: {
          id: latestDrinkInDate.id,
        },
      });
      console.log("debug", "deleted");
      res.status(200).json({ msg: "success" });
    } else {
      res.status(200).json({ msg: "contents not found" });
    }
  }
  return;
}
