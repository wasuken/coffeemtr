import { useState } from "react";
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
  const { data } = useSWR<IDrinkItem[]>(`/api/drinks`, fetcher);
  let lineData: ILineBarData = { labels: [], datasets: [] };
  if (data) {
    let map = new Map<string, IDrinkTotalItem>();
    console.log('debug', data)
    data.forEach((drink) => {
      const key: string = genkey(drink.createdAt);
      let newDrink: IDrinkTotalItem = {num: 1, ...drink};
      let oldDrink: IDrinkTotalItem | undefined = map.get(key);
      if (oldDrink === undefined) {
        map.set(key, newDrink);
      } else {
        newDrink.caffeine_contents_mg += oldDrink.caffeine_contents_mg;
        newDrink.num += 1;
        map.set(key, newDrink);
      }
    });
    const keys = Array.from(map.keys());
    lineData.labels = keys;
    const chartData = keys.map((k) => {
      return chartType === 0
        ? map.get(k)?.caffeine_contents_mg
        : map.get(k)?.num;
    });
    lineData.datasets = [
      {
        label: "bar 1",
        data: chartData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ];
  }
  return (
    <Container>
      <h3>Chart</h3>
      <FormArea>
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
        <SimpleChartPage title="カフェインチャート" data={lineData} />
      </ChartArea>
    </Container>
  );
}
