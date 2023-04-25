import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useAuthContext } from "@/contexts/auth";

interface Props {
  children: React.ReactNode;
  items: { text: string; href: string }[];
}

export default function Layout({ children, items }: Props) {
  const [authState, setAuthState] = useAuthContext();
  const { isLoggedIn } = authState;
  return (
    <Container>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Coffee Meter</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {items.map((item, k) => (
                <Nav.Link key={k} href={item.href}>
                  {item.text}
                </Nav.Link>
              ))}
            </Nav>
            {isLoggedIn && (
              <Nav className="justify-content-end">
                <NavDropdown title="アカウント" id="basic-nav-dropdown">
                  <NavDropdown.Item
                    onClick={() =>
                      setAuthState({ token: "", isLoggedIn: false })
                    }
                  >
                    ログアウト
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {children}
    </Container>
  );
}
