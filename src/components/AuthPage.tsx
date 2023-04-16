import { useRouter } from "next/router";
import {  useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/auth";

interface Props {
  children: React.ReactNode;
}

export default function AuthPage({ children }: Props) {
  const router = useRouter();
  const [authState] = useAuthContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      if (!authState.isLoggedIn) {
        // ログインされていない場合の処理
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };
    checkLogin();
  }, [authState.isLoggedIn]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
