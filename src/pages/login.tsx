import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth";
import styled from "styled-components";
import { HEADER_ITEMS } from "@/const";
import Layout from "@/components/layout";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: bold;
`;

const Button = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #0070f3;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
`;

type LoginFormState = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [formState, setFormState] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const [authState, setAuthState] = useAuthContext();
  const router = useRouter();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    });

    if (response.ok) {
      const data = await response.json();
      setAuthState({ token: data.token, isLoggedIn: true });
      router.push("/");
    } else {
      alert("Invalid credentials");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      if (authState.isLoggedIn) {
        router.replace("/");
      } else {
        setLoading(false);
      }
    };
    checkLogin();
  }, [authState.isLoggedIn, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout items={HEADER_ITEMS}>
      <Container>
        <Form onSubmit={handleFormSubmit}>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleInputChange}
          />
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={formState.password}
            onChange={handleInputChange}
          />
          <Button type="submit">Login</Button>
        </Form>
      </Container>
    </Layout>
  );
}
