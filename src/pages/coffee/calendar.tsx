import AuthPage from "@/components/AuthPage";
import Calendar from "@/containers/coffee/calendar";
import { HEADER_ITEMS } from "@/const";
import Layout from "@/components/layout";

export default function Index() {
  return (
    <AuthPage>
      <Layout items={HEADER_ITEMS}>
        <Calendar />
      </Layout>
    </AuthPage>
  );
}
