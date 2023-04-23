import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/auth";

interface Props {
  children: React.ReactNode;
}

export default function AuthPage({ children }: Props) {
  const router = useRouter();
  const [authState, setAuthState] = useAuthContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      if (authState.isLoggedIn) {
        setLoading(false);
      } else {
        // ログインされていない場合の処理
        router.replace("/login");
        return null;
      }
    };
    const fetchToken = async () => {
      const res = await fetch(`/api/auth`, {
        headers: {
          Authorization: `Bearer: ${authState.token}`,
        },
      });
      if (!res.ok) {
        setAuthState({ token: "", isLoggedIn: false });
        router.replace("/login");
        return null;
      }
    };
    checkLogin();
    fetchToken();
  }, [router, authState.isLoggedIn, authState.token, setAuthState]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
