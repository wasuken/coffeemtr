import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import useSWR from "swr";
import { IDrinkItem, ILineBarData, IDrinkTotalItem } from "@/const";
import SimpleChartPage from "@/components/SimpleChartPage";
import styled from "styled-components";
interface IDrinkFetcher {
  drinkData: Map<string, IDrinkTotalItem>;
  ymList: string[];
}

const FormArea = styled.div`
  width: 80vw;
`;

const ChartArea = styled.div`
  width: 80vw;
  height: 50vh;
`;

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

function genkey(ds: string): string {
  const dt = new Date(ds);
  return [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join("-");
}
function genNewKey(): string {
  const dt = new Date();
  return [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join("-");
}
function genNewYM(): string {
  const dt = new Date();
  return [dt.getFullYear(), dt.getMonth() + 1].join("-");
}

export default function Index() {
  const [chartType, setChartType] = useState<number>(0);
  const [yMin, setYMin] = useState<number>(0);
  const [yMax, setYMax] = useState<number>(1000);
  const [ymonth, setYMonth] = useState<string>(genNewYM());
  const [lineChartData, setLineChartData] = useState<ILineBarData | undefined>(
    undefined
  );
  const drinkFetcher = async (url: string) => {
    const res = await fetch(url);
    const data = await res.json();
    const map = new Map<string, IDrinkTotalItem>();
    const ym_set = new Set<string>();
    if (!data) {
      return {
        drinkData: map,
        ymList: [],
      };
    }
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
    const ymList = Array.from(ym_set);
    const df: IDrinkFetcher = {
      drinkData: map,
      ymList,
    };
    return df;
  };
  const drinkChartFetcher = async (url: string) => {
    const { drinkData: map, ymList }: IDrinkFetcher = await drinkFetcher(url);
    if (ymList.length > 0) generateChartData(ymList[0], 0);
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
  function handleYMonthSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const ym = e.target.value;
    setYMonth(ym);
    generateChartData(ym, chartType);
  }
  function generateChartData(ym: string, cType: number) {
    if (!drinkData) return;
    listMonthDays(ym).forEach((ymd) => {
      if (!drinkData.has(ymd)) {
        const eDrink: IDrinkTotalItem = {
          id: 0,
          num: 0,
          createdAt: "",
          caffeine_contents_mg: 0,
        };
        drinkData.set(ymd, eDrink);
      }
    });
    let keys: string[] = Array.from(drinkData.keys()).filter((dk: string) =>
      dk.startsWith(ym)
    );
    // 効率ゴミだけどサンプル数たいしたことないのでヨシ!
    keys.sort((a, b) => {
      if((new Date(a)) > (new Date(b))){
        return 1;
      }else{
        return -1;
      }
    });

    let lineData: ILineBarData = { labels: [], datasets: [] };
    lineData.labels = keys;
    const chartData = keys.map((k) => {
      return cType === 0
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
  function handleCharType(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = parseInt(e.target.value);
    setChartType(v);
    if (v === 0) {
      setYMin(0);
      setYMax(1000);
    } else {
      setYMin(0);
      setYMax(10);
    }
    generateChartData(ymonth, v);
  }
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
          <Form.Select onChange={handleCharType} value={chartType}>
            <option value={0}>カフェイン量(mg)</option>
            <option value={1}>コーヒーのんだ回数</option>
          </Form.Select>
        </Form.Group>
      </FormArea>
      <ChartArea>
        {lineChartData !== undefined && (
          <SimpleChartPage
            title="カフェインチャート"
            data={lineChartData}
            min={yMin}
            max={yMax}
          />
        )}
      </ChartArea>
    </Container>
  );
}
