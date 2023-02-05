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


function generateOpt(title: string){
  return {
    responsive: true,
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
    <Line options={generateOpt(props.title)} data={props.data} />
  )
}
