import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, User } from "@prisma/client";
import { COFFEE_CAFFEINE } from "@/const";
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
  if (req.method === "POST") {
    let { mg, drink_at: drankAt } = req.body;
    if (!mg) mg = COFFEE_CAFFEINE;
    if (!drankAt) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      drankAt = now.toISOString().slice(0, -1);
    }
    const createdAt = new Date(drankAt);
    await prisma.drinkCoffeeHistory.create({
      data: {
        caffeine_contents_mg: mg,
        createdAt,
        userId,
      },
    });
    res.status(200).json({ msg: "success" });
    return;
  } else if (req.method === "GET") {
    const dt = new Date();
    const df = [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join("-");
    const dfb = `${df} 00:00:00`;
    const dfe = `${df} 23:59:59`;
    const drinkHistory = await prisma.drinkCoffeeHistory.findMany({
      where: {
        createdAt: {
          gte: new Date(dfb),
          lte: new Date(dfe),
        },
        userId,
      },
    });
    res.status(200).json(drinkHistory);
    return;
  } else if (req.method === "DELETE") {
    const { date: datestr } = req.query;
    if (typeof datestr !== "string") {
      res.status(400).json({ msg: "not date string." });
      return;
    }
    let date = new Date(datestr);
    if (!date) date = new Date();
    const latestDrinkInDate = await prisma.drinkCoffeeHistory.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (latestDrinkInDate !== null) {
      // 削除対象があるので、削除処理を行う
      await prisma.drinkCoffeeHistory.delete({
        where: {
          id: latestDrinkInDate.id,
        },
      });
      res.status(200).json({ msg: "success" });
      return;
    } else {
      res.status(200).json({ msg: "contents not found" });
      return;
    }
  }
  return;
}
