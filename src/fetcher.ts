import { IDrinkTotalItem, IDrinkItem, IDrinkFetcher } from "@/const";
import { genkey } from "@/util";

export async function drinkFetcher(url: string) {
  const res = await fetch(url);
  const data = await res.json();
  const map = new Map<string, IDrinkTotalItem>();
  const ym_set = new Set<string>();
  if (!data) {
    return {
      drinkData: map,
}
  data.forEach((drink: IDrinkItem) => {
    const key: string = genkey(drink.createdAt);
    const [yr, ms, _] = key.split("-");
    ym_set.add([yr, ms].join("-"));
    let newDrink: IDrinkTotalItem = { children: [drink], num: 1, ...drink };
    let oldDrink: IDrinkTotalItem | undefined = map.get(key);
    if (oldDrink === undefined) {
      map.set(key, newDrink);
    } else {
      newDrink.caffeine_contents_mg += oldDrink.caffeine_contents_mg;
      newDrink.num += oldDrink.num;
      newDrink.children = [...newDrink.children, ... oldDrink.children]
      map.set(key, newDrink);
    }
  });
  const ymList = Array.from(ym_set);
  const df: IDrinkFetcher = {
    drinkData: map,
    ymList,
  };
  return df;
}
