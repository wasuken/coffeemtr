import AuthPage from "@/components/AuthPage";
import Coffee from "@/containers/coffee";
import { HEADER_ITEMS } from "@/const";
import Layout from "@/components/layout";

export default function Index() {
  return (
    <AuthPage>
      <Layout items={HEADER_ITEMS}>
        <Coffee />
      </Layout>
    </AuthPage>
  );
}
