import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import useSWR, { useSWRConfig } from "swr";
import CoffeeList from "@/components/coffee/CoffeeList";
import CaffeineMeter from "@/components/coffee/CaffeineMeter";
import { COFFEE_CAFFEINE, ONE_DAY_MAX_CAFFEINE_MG } from "@/const";
import { Button } from "react-bootstrap";
import styled from "styled-components";

const ButtonArea = styled.div`
  display: flex;
  width: 50vw;
  gap: 5px;
`

const inter = Inter({ subsets: ["latin"] });
const fetcher = (...args) => fetch(...args).then((res) => res.json());

function dfFromDt(dt) {
  return [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join("-");
}

export default function Home() {
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
    fetch("/api/drink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
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
  return (
    <>
      <h2>History</h2>
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
