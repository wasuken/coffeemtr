// コーヒー150ml中に入ってるカフェイン量(mg)
export const COFFEE_CAFFEINE = 80;

export const ONE_DAY_MAX_CAFFEINE_MG = 400;

export interface IDrinkItem {
  id: number;
  createdAt: string;
  caffeine_contents_mg: number;
}

export interface ILineBarDataDataset {
  label: string;
  data: (number|undefined)[];
  borderColor: string;
  backgroundColor: string;
}

export interface ILineBarData {
  labels: string[];
  datasets: ILineBarDataDataset[];
}

export interface ISimpleChartPageProps {
  title: string;
  data: ILineBarData;
}
