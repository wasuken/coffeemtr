import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import useSWR from "swr";
import { IDrinkItem, ILineBarData, IDrinkTotalItem } from "@/const";
import SimpleChartPage from "@/components/SimpleChartPage";
import styled from "styled-components";

const FormArea = styled.div`
  width: 80vw;
`;

const ChartArea = styled.div`
  width: 80vw;
  height: 50vh;
`;

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function genkey(ds: string): string {
  const dt = new Date(ds);
  return [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join("-");
}

export default function Index() {
  const [chartType, setChartType] = useState<number>(0);
  const [drinkData, setDrinkData] = useState<
    Map<string, IDrinkTotalItem> | undefined
  >(undefined);
  const [ymonth, setYMonth] = useState<string>("");
  const [ymList, setYmList] = useState<string[]>([]);
  const [lineChartData, setLineChartData] = useState<ILineBarData | undefined>(
    undefined
  );
  const drinkFetcher = async (url: string) => {
    const res = await fetch(url);
    const data = await res.json();
    if (!data) return false;
    const map = new Map<string, IDrinkTotalItem>();
    const ym_set = new Set<string>();
    data.forEach((drink: IDrinkItem) => {
      const key: string = genkey(drink.createdAt);
      const [yr, ms, _] = key.split("-");
      ym_set.add([yr, ms].join("-"));
      let newDrink: IDrinkTotalItem = { num: 1, ...drink };
      let oldDrink: IDrinkTotalItem | undefined = map.get(key);
      if (oldDrink === undefined) {
        map.set(key, newDrink);
      } else {
        newDrink.caffeine_contents_mg += oldDrink.caffeine_contents_mg;
        newDrink.num += oldDrink.num;
        map.set(key, newDrink);
      }
    });
    const ymlist = Array.from(ym_set);
    setYmList(ymlist);
    setDrinkData(map);
  };
  function handleYMonthSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const ym = e.target.value;
    setYMonth(ym);
    ChangeYMonthSelect(ym);
  }
  function ChangeYMonthSelect(ym: string) {
    if (drinkData === undefined) return;
    const keys = Array.from(drinkData.keys()).filter((dk: string) =>
      dk.startsWith(ym)
    );
    let lineData: ILineBarData = { labels: [], datasets: [] };
    lineData.labels = keys;
    const chartData = keys.map((k) => {
      return chartType === 0
        ? drinkData.get(k)?.caffeine_contents_mg
        : drinkData.get(k)?.num;
    });
    lineData.datasets = [
      {
        label: "bar 1",
        data: chartData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ];
    setLineChartData(lineData);
  }
  useEffect(() => {
    drinkFetcher('/api/drinks');
  }, [])
  return (
    <Container>
      <h3>Chart</h3>
      <FormArea>
        <Form.Group className="mb-3 w-50">
          <Form.Label>月</Form.Label>
          <Form.Select onChange={handleYMonthSelect} value={ymonth}>
            {[...Array.from(ymList)].map((x, i) => (
              <option value={x} key={i}>
                {x}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3 w-50">
          <Form.Label>チャートの値</Form.Label>
          <Form.Select
            onChange={(e) => setChartType(parseInt(e.target.value))}
            value={chartType}
          >
            <option value={0}>カフェイン量(mg)</option>
            <option value={1}>コーヒーのんだ回数</option>
          </Form.Select>
        </Form.Group>
      </FormArea>
      <ChartArea>
        {lineChartData !== undefined && (
          <SimpleChartPage title="カフェインチャート" data={lineChartData} />
        )}
      </ChartArea>
    </Container>
  );
}
