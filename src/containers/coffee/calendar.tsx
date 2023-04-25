import useSWR from "swr";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import CalendarPage from "@/components/CalendarPage";
import { useAuthContext } from "@/contexts/auth";

import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";

import dayjs from "dayjs";

registerLocale("ja", ja);

export default function Calendar() {
  const [authState] = useAuthContext();
  const fetcher = (url: string) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer: ${authState.token}`,
      },
    }).then((r) => r.json());
  const [date, setDate] = useState<Date>(new Date());
  const yMonth = dayjs(date).format("YYYY-MM");
  const { data, error, isLoading } = useSWR(
    `/api/drink/calendar?ym=${yMonth}`,
    fetcher
  );
  if (error) return <div>error.</div>;
  if (isLoading) return <div>loading...</div>;
  // fetch data
  return (
    <>
      <DatePicker
        locale="ja"
        selected={date}
        onChange={(dt: Date) => setDate(dt)}
        dateFormat="yyyy/MM"
        showMonthYearPicker
      />
      <CalendarPage data={data} ym={dayjs(date).format("YYYY-MM")} />
    </>
  );
}
