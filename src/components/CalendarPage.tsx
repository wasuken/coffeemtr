import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";

export const CoffeeCalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 10px;
`;

export const CalendarHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 14.28%;
  font-weight: bold;
  color: #555;
  border: solid 1px black;
`;

export const CalendarCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 14.28%;
  border: solid 1px black;
  background-color: rgba(32, 199, 60, ${props => props.level / 255});
`;

export const CalendarBody = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
`;

export const CalendarDay = styled.div`
  font-size: 1.2em;
`;

export const CalendarCount = styled.div`
  font-size: 0.8em;
  margin-left: 5px;
`;

interface CoffeeCalendarProps {
  data: { ymd: string; value: number }[];
  ym: string;
}

const CoffeeCalendar: React.FC<CoffeeCalendarProps> = ({ data, ym }) => {
  // 全ての日付を持つ配列を生成
  const dates = [];
  let startDate = dayjs(new Date(ym)).startOf("month");
  const endDate = dayjs(new Date(ym)).endOf("month");
  while (startDate.isBefore(endDate)) {
    dates.push(startDate.format("YYYY-MM-DD"));
    startDate = startDate.add(1, "day");
  }

  // 各日付のコーヒー飲用回数を集計
  const counts = {};
  for (const { createdAt, caffeine_contents_mg } of data) {
    const ymd = dayjs(new Date(createdAt)).format("YYYY-MM-DD");
    if (counts[ymd]) {
      counts[ymd] += caffeine_contents_mg;
    } else {
      counts[ymd] = caffeine_contents_mg;
    }
  }
  console.log(counts);

  // カレンダーの表示部分のJSX
  const calendarCells = dates.map((date) => {
    const count = counts[date] ?? 0;
    const day = dayjs(date).format("D");
    return (
      <CalendarCell key={date} level={count}>
        <CalendarDay>{day}</CalendarDay>
        <CalendarCount>{count/80} 杯</CalendarCount>
      </CalendarCell>
    );
  });

  // ヘッダー部分のJSX
  const headerCells = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
    (day) => <CalendarHeader key={day}>{day}</CalendarHeader>
  );

  // カレンダー全体のJSX
  return (
    <CoffeeCalendarContainer>
      <CalendarHeaderContainer>{headerCells}</CalendarHeaderContainer>
      <CalendarBody>{calendarCells}</CalendarBody>
    </CoffeeCalendarContainer>
  );
};

export default CoffeeCalendar;
