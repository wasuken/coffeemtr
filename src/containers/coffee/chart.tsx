import { useState } from "react";
import { Container } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import useSWR from "swr";
import styled from "styled-components";
import { useAuthContext } from "@/contexts/auth";

import { genNewYM } from "@/util";
import SimpleChartPage from "@/components/SimpleChartPage";

const FormArea = styled.div`
  width: 80vw;
`;

const ChartArea = styled.div`
  width: 80vw;
  height: 50vh;
`;

export default function Chart() {
  const [authState] = useAuthContext();
  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer: ${authState.token}`,
      },
    });
    if (!res.ok) {
      const error = new Error(
        `An error occurred while fetching the data[status: ${res.status}.`
      );
      throw error;
    }
    return res.json();
  };
  const [yMonth, setYMonth] = useState<string>(genNewYM());
  const { data, error, isLoading } = useSWR(
    `/api/drink/chart?ym=${yMonth}`,
    fetcher
  );
  const {
    data: ymList,
    error: ymError,
    isLoading: isYMLoading,
  } = useSWR<string[]>(`/api/drink/ymlist`, fetcher);

  function handleYMonthSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    setYMonth(e.target.value);
  }
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
