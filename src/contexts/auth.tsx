import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

type AuthState = {
  token: string | null;
  isLoggedIn: boolean;
};

type AuthContextType = [
  AuthState,
  React.Dispatch<React.SetStateAction<AuthState>>
];

export const AuthContext = createContext<AuthContextType>([
  { token: null, isLoggedIn: false },
  () => {},
]);

export const AuthProvider: React.FC = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedState = Cookies.get("authState");
    return storedState ? JSON.parse(storedState) : { token: null, isLoggedIn: false };
  });

  useEffect(() => {
    Cookies.set("authState", JSON.stringify(authState));
  }, [authState]);

  return (
    <AuthContext.Provider value={[authState, setAuthState]}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext(): AuthContextType {
  return useContext(AuthContext);
}
