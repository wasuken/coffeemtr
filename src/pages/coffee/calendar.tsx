import useSWR from "swr";
import "react-datepicker/dist/react-datepicker.css"
import { useState } from "react";
import CalendarPage from "@/components/CalendarPage";
import { genNewYM } from "@/util";

import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";

import dayjs from "dayjs";

registerLocale("ja", ja);

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Index() {
  const [date, setDate] = useState<Date>(new Date());
  const yMonth = dayjs(date).format("YYYY-MM");
  console.log(yMonth);
  const { data, error, isLoading } = useSWR(
    `/api/drink/calendar?ym=${yMonth}`,
    fetcher,
    { key: `/api/drink/calendar?ym=${yMonth}` }
  );
  if (error) return <div>error.</div>;
  if (isLoading) return <div>loading...</div>;
  // fetch data
  return (
    <>
      <DatePicker
		locale="ja"
				selected={date}
				onChange={(dt) => setDate(dt)}
				dateFormat="yyyy/MM"
				showMonthYearPicker
      />
      <CalendarPage data={data} ym={dayjs(date).format("YYYY-MM")} />
    </>
  );
}
