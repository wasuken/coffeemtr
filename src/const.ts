// コーヒー150ml中に入ってるカフェイン量(mg)
export const COFFEE_CAFFEINE = 80;

export const ONE_DAY_MAX_CAFFEINE_MG = 400;

// interfaces
export interface IDrinkFetcher {
  drinkData: Map<string, IDrinkTotalItem>;
  ymList: string[];
}

export interface IDrinkItem {
  id: number;
  createdAt: string;
  caffeine_contents_mg: number;
}

export interface IDrinkTotalItem extends IDrinkItem {
  num: number;
  children: IDrinkItem[];
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

// props
export interface ICalendarPageProps {
  dt: Date;
  items: Map<string, IDrinkTotalItem>;
}
export interface ISimpleChartPageProps {
  title: string;
  data: ILineBarData;
  max: number;
  min: number;
}

export interface CoffeeListProps {
  title: string;
  data: IDrinkItem[];
  error: boolean;
}
