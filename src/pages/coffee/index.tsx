import useSWR, { useSWRConfig } from "swr";
import { useState } from "react";
import CoffeeList from "@/components/coffee/CoffeeList";
import CaffeineMeter from "@/components/coffee/CaffeineMeter";
import { COFFEE_CAFFEINE, ONE_DAY_MAX_CAFFEINE_MG } from "@/const";
import { Button, Form, Container } from "react-bootstrap";
import styled from "styled-components";

const ButtonArea = styled.div`
  display: flex;
  width: 50vw;
  gap: 5px;
`;

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function dfFromDt(dt: Date) {
  return [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join("-");
}

export default function Home() {
  function genNowFmt() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, -5);
  }
  const [drinkAt, setDrinkAt] = useState<string>(genNowFmt());
  const { mutate } = useSWRConfig();
  const dt = new Date();
  let params = "";
  if (dt !== undefined) {
    const df = dfFromDt(dt);
    params = `?date=${df}`;
  }
  const { data, error } = useSWR(`/api/drink${params}`, fetcher);
  let nowmgper = 0;
  let nowmgLabel = "";
  if (data) {
    const nowmg = data.length * COFFEE_CAFFEINE;
    nowmgper = (nowmg / ONE_DAY_MAX_CAFFEINE_MG) * 100;
    nowmgLabel = `${nowmg} / ${ONE_DAY_MAX_CAFFEINE_MG} (mg)`;
  }
  function drinkClick() {
    const body = {};
    if (drinkAt !== "") body.drink_at = drinkAt;
    fetch("/api/drink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((res) => {
      const dt = new Date();
      const df = dfFromDt(dt);
      mutate(`/api/drink?date=${df}`);
    });
  }
  function cancelClick() {
    const dt = new Date();
    const df = dfFromDt(dt);
    fetch(`/api/drink?date=${df}`, {
      method: "DELETE",
    }).then((res) => {
      console.log(res);
      const dt = new Date();
      const df = dfFromDt(dt);
      mutate(`/api/drink?date=${df}`);
    });
  }
  function changeDrinkAt(e: React.ChangeEvent<HTMLInputElement>) {
    const dtf = e.target.value;
    setDrinkAt(dtf);
    console.log(dtf);
  }
  return (
    <>
      <h2>History</h2>
      <div>Drink At</div>
      <Container className="mb-3 d-flex start">
        <Form.Group>
          <Form.Control
            value={drinkAt}
            onChange={changeDrinkAt}
            type="datetime-local"
            id="drink_datetime"
            placeholder="drink_at"
          />
        </Form.Group>
        <Button variant="primary" onClick={(e) => setDrinkAt(genNowFmt())}>
          set now
        </Button>
      </Container>
      <ButtonArea>
        <Button variant="primary" onClick={drinkClick}>
          drink coffee
        </Button>
        <Button variant="primary" onClick={cancelClick}>
          cancel drink latest
        </Button>
      </ButtonArea>
      <div>
        <div>{data && <CaffeineMeter mg={nowmgper} label={nowmgLabel} />}</div>
        <CoffeeList title="今日" dt={dt} data={data} error={error} />
      </div>
    </>
  );
}
