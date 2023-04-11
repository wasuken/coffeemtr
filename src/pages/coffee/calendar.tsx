import useSWR from "swr";
import { useState } from "react";
import CalendarPage from "@/components/CalendarPage";
import { genNewYM } from "@/util";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Index() {
  const [yMonth, setYMonth] = useState<string>(genNewYM());
  const { data, error, isLoading } = useSWR(
    `/api/drink/calendar?ym=${yMonth}`,
    fetcher,
    { key: `/api/drink/calendar?ym=${yMonth}` }
  );
  if(error) return <div>error.</div>
  if(isLoading) return <div>loading...</div>
  // fetch data
  return <CalendarPage data={data} />;
}
