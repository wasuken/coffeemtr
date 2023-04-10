import CalendarPage from '@/components/CalendarPage'
import 'react-calendar/dist/Calendar.css';
import useSWR from "swr";

import { IDrinkTotalItem, IDrinkFetcher  } from "@/const";
import { drinkFetcher } from '@/fetcher'

export default function Index(){
  // fetch data
  const drinkChartFetcher = async (url: string) => {
    const { drinkData: map, ymList }: IDrinkFetcher = await drinkFetcher(url);
    // if (ymList.length > 0) generateChartData(ymList[0], 0);
    return {
      drinkData: map,
      ymList,
    };
  };
  let drinkData = new Map<string, IDrinkTotalItem>();
  let ymList: string[] = [];
  const { data } = useSWR("/api/drinks", drinkChartFetcher);
  if (data) {
    const { drinkData: dd, ymList: yl } = data;
    drinkData = dd;
    ymList = yl;
  }
  //   commonize fetch function
  // data send to CalendarPage param
  return (
    <CalendarPage dt={new Date()} items={drinkData} />
  )
}
