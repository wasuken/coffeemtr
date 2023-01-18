import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import useSWR, { useSWRConfig } from "swr";

const inter = Inter({ subsets: ["latin"] });

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function dfFromDt(dt) {
  return [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join("-");
}

export default function Home() {
  const { data, error } = useSWR("/api/drink", fetcher);
  let dmap = {};
  const { mutate } = useSWRConfig();
  function click() {
    fetch("/api/drink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then((res) => {
      mutate("/api/drink");
    });
  }
  if (error) return <div>failed</div>;
  if (!data) return <div>loading...</div>;
  data.forEach((v) => {
    const dt = new Date(v.createdAt);
    const key = dfFromDt(dt);
    if (!dmap[key]) dmap[key] = [];
    dmap[key].push(v);
  });
  return (
    <>
      <h2>History</h2>
      <div>
        <button onClick={click}>drink coffee</button>
      </div>
      <div>
        <div>
          <h4>今日</h4>
        </div>
        <div>
          {dmap[dfFromDt(new Date())] &&
            dmap[dfFromDt(new Date())].map((hist, i) => (
              <img src="/coffee.png" alt="" />
            ))}
        </div>
      </div>
    </>
  );
}
