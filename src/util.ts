// utils
export function listMonthDays(ym: string) {
  const st = new Date(ym + "-01");
  let cur = new Date(st.getFullYear(), st.getMonth(), 1);
  const lastDay = new Date(st.getFullYear(), st.getMonth() + 1, 0);
  let rst = [];
  while (cur < lastDay) {
    const v = [cur.getFullYear(), cur.getMonth() + 1, cur.getDate()].join("-");
    rst.push(v);
    cur.setDate(cur.getDate() + 1);
  }
  return rst;
}

export function genkey(ds: string): string {
  const dt = new Date(ds);
  return [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join("-");
}
export function genNewKey(): string {
  const dt = new Date();
  return [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join("-");
}
export function genNewYM(): string {
  const dt = new Date();
  return [dt.getFullYear(), dt.getMonth() + 1].join("-");
}

