import { CoffeeListProps, IDrinkItem } from "@/const";
import Image from "next/image";

function dfFromDt(dt: Date) {
  return [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join("-");
}

export default function CoffeeList(props: CoffeeListProps) {
  const { data, error } = props;
  let dmap: Map<string, IDrinkItem[]> = new Map();
  if (error) return <div>error</div>;
  if (!data) return <div>loading...</div>;
  data.forEach((v) => {
    const dt = new Date(v.createdAt);
    const key = dfFromDt(dt);
    if (!dmap.has(key)) dmap.set(key, []);
    dmap.get(key)?.push(v);
  });
  return (
    <div>
      <div>
        <h4>{props.title}</h4>
      </div>
      <div>
        {dmap.get(dfFromDt(new Date())) &&
          dmap
            .get(dfFromDt(new Date()))
            ?.map((_hist, i) => (
              <Image key={i} src="/coffee.png" width="36" height="36" alt="" />
            ))}
      </div>
    </div>
  );
}
