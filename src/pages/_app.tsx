import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "@/components/layout";
import { AuthProvider } from "@/contexts/auth"

const items = [
  {
    text: "Input",
    href: "/coffee",
  },
  {
    text: "Chart",
    href: "/coffee/chart",
  },
  {
    text: "Calendar",
    href: "/coffee/calendar",
  },
];

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
	  <Layout items={items}>
		<Component {...pageProps} />
      </Layout>
	</AuthProvider>
  );
}
