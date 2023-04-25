import AuthPage from "@/components/AuthPage";
import Chart from "@/containers/coffee/chart";
import { HEADER_ITEMS } from "@/const";
import Layout from "@/components/layout";

export default function Index() {
  return (
    <AuthPage>
      <Layout items={HEADER_ITEMS}>
        <Chart />
      </Layout>
    </AuthPage>
  );
}
