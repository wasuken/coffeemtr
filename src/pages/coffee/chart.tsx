import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import useSWR from "swr";
import styled from "styled-components";

import { genNewYM } from "@/util";
import SimpleChartPage from "@/components/SimpleChartPage";

const FormArea = styled.div`
  width: 80vw;
`;

const ChartArea = styled.div`
  width: 80vw;
  height: 50vh;
`;

const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((j) => {
  console.log("dededebug", j)
  return j;
});

export default function Index() {
  const [yMonth, setYMonth] = useState<string>(genNewYM());
  const { data, error, isLoading } = useSWR(
    `/api/drink/chart?ym=${yMonth}`,
    fetcher,
	{ key: `/api/drink/chart?ym=${yMonth}`},
  );
  const {
    data: ymList,
    error: ymError,
    isLoading: isYMLoading,
  } = useSWR(`/api/drink/ymlist`, fetcher);

  function handleYMonthSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setYMonth(e.target.value);
  }
  console.log(data);
  if (isLoading || isYMLoading) return <div>loading...</div>;
  if (error || ymError) return <div>error.</div>;
  return (
    <Container>
      <h3>Chart</h3>
      {ymList && (
        <FormArea>
          <Form.Group className="mb-3 w-50">
            <Form.Label>月</Form.Label>
            <Form.Select onChange={handleYMonthSelect} value={yMonth}>
              {ymList.map((x, i) => (
                <option value={x} key={i}>
                  {x}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </FormArea>
      )}
      {data && (
        <ChartArea>
          <SimpleChartPage
            title="カフェインチャート"
            data={data}
            min={0}
            max={400}
          />
        </ChartArea>
      )}
    </Container>
  );
}
