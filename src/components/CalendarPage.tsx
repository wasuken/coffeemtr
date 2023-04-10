import Calendar from "react-calendar";
import { ICalendarPageProps } from '@/const'

export default function CalendarPage(props: ICalendarPageProps) {
  // items mapping to Calendar
  //   click event -> show detail
  //      detail: mg, createdAt
  return <Calendar value={props.dt} />;
}
