import useSWR, { useSWRConfig } from "swr";

function dfFromDt(dt) {
  return [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join("-");
}

export interface CoffeeListProps {
  title: string;
  dt: Date | undefined;
  data: DrinkHistory[];
  error: boolean;
}

export default function CoffeeList(props) {
  const { data, error } = props;
  let dmap = {};
  if (error) return <div>error</div>;
  if (!data) return <div>loading...</div>;
  data.forEach((v) => {
    const dt = new Date(v.createdAt);
    const key = dfFromDt(dt);
    if (!dmap[key]) dmap[key] = [];
    dmap[key].push(v);
  });
  return (
    <div>
      <div>
        <h4>{props.title}</h4>
      </div>
      <div>
        {dmap[dfFromDt(new Date())] &&
          dmap[dfFromDt(new Date())].map((hist, i) => (
            <img key={i} src="/coffee.png" alt="" />
          ))}
      </div>
    </div>
  );
}
