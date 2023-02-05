import styled from "styled-components";
import { Container } from "react-bootstrap";
import useSWR, { useSWRConfig } from "swr";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from "react-chartjs-2";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "カフェチャート",
    },
  },
};

function genkey(ds: string): string {
  const dt = new Date(ds);
  return [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join("-");
}

interface IDrinkItem {
  id: number;
  createdAt: string;
  caffeine_contents_mg: number;
}

interface ILineBarDataDataset {
  label: string;
  data: (number|undefined)[];
  borderColor: string;
  backgroundColor: string;
}

interface ILineBarData {
  labels: string[];
  datasets: ILineBarDataDataset[];
}

export default function Index() { // const { mutate } = useSWRConfig();
  const { data } = useSWR<IDrinkItem[]>(`/api/drinks`, fetcher);
  let lineData: ILineBarData = { labels: [], datasets: [] };
  if (data) {
    let map = new Map<string, IDrinkItem>();
    data.forEach((drink) => {
      const key: string = genkey(drink.createdAt);
      let newDrink = drink;
      let oldDrink: IDrinkItem | undefined = map.get(key);
      if (oldDrink === undefined) {
        map.set(key, drink);
      }else{
        newDrink.caffeine_contents_mg += oldDrink.caffeine_contents_mg;
        map.set(key, newDrink);
      }
    });
    const keys = Array.from(map.keys());
    lineData.labels = keys;
    lineData.datasets = [
      {
        label: "bar 1",
        data: keys.map((k) => map.get(k)?.caffeine_contents_mg),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ];
  }
  return (
    <Container>
      <h3>Chart</h3>
      <div>
        <Line options={options} data={lineData} />
      </div>
    </Container>
  );
}
