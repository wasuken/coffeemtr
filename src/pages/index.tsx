import Container from "react-bootstrap/Container";
import AuthPage from "@/components/AuthPage";
import { HEADER_ITEMS } from "@/const";
import Layout from "@/components/layout";

export default function Index() {
  return (
    <AuthPage>
      <Layout items={HEADER_ITEMS}>
        <Container>Index</Container>
      </Layout>
    </AuthPage>
  );
}
