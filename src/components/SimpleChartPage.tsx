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
import { ISimpleChartPageProps } from '@/const'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


function generateOpt(title: string, max: number, min: number){
  return {
    responsive: true,
    scales: {
      y: {
        max,
        min,
      }
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title, 
      },
    },
  }

}

export default function SimpleChartPage(props: ISimpleChartPageProps){
  return (
    <Line options={generateOpt(props.title, props.max, props.min)} data={props.data} />
  )
}
