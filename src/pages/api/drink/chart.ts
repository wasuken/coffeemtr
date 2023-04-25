import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, User, DrinkCoffeeHistory } from "@prisma/client";
import { authUser } from "@/lib/lib";
import { IDrinkTotalItem, genInputDate } from "@/const";

const prisma = new PrismaClient();

function listMonthDays(ym: string) {
  const st = new Date(ym + "-01");
  let cur = new Date(st.getFullYear(), st.getMonth(), 1);
  const lastDay = new Date(st.getFullYear(), st.getMonth() + 1, 0);
  let rst = [];
  while (cur < lastDay) {
    const v = [cur.getFullYear(), cur.getMonth() + 1, cur.getDate()].join("-");
    rst.push(v);
    cur.setDate(cur.getDate() + 1);
  }
  return rst;
}

function generateChartData(ym: string, drinkHistory: DrinkCoffeeHistory[]) {
  let drinkData = new Map<string, IDrinkTotalItem>();
  // mapを初期化
  listMonthDays(ym).forEach((ymd) => {
    const eDrink: IDrinkTotalItem = {
      id: 0,
      num: 0,
      createdAt: "",
      caffeine_contents_mg: 0,
      children: [],
    };
    drinkData.set(ymd, eDrink);
  });
  let keys: string[] = Array.from(drinkData.keys()).filter((dk: string) =>
    dk.startsWith(ym)
  );
  drinkHistory.forEach((drink) => {
    const dt = drink.createdAt;
    const yymd = [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join("-");
    if (drinkData.has(yymd)) {
      let newDrink: IDrinkTotalItem | undefined = drinkData.get(yymd);
      if (newDrink !== undefined) {
        newDrink.num += 1;
        newDrink.caffeine_contents_mg += drink.caffeine_contents_mg;
        newDrink.children.push({ ...drink, createdAt: yymd });
      }
    }
  });
  // 効率ゴミだけどサンプル数たいしたことないのでヨシ!
  keys.sort((a, b) => {
    if (new Date(a) > new Date(b)) {
      return 1;
    } else {
      return -1;
    }
  });

  const chartData = keys.map((k) => {
    return drinkData.get(k)?.caffeine_contents_mg;
  });
  return { labels: keys, datasets: [{ label: "mg", data: chartData }] };
}

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
    const data = generateChartData(year_month, histList);
    res.status(200).json(data);
    return;
  }
}
