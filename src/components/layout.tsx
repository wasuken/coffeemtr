import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

interface Props {
  children: React.ReactNode;
  items: {text: string, href: string};
}


export default function Layout({ children, items }: Props) {
  return (
    <Container>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Coffee Meter</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
			  {items.map((item, k) => (
				<Nav.Link key={k} href={item.href}>{item.text}</Nav.Link>
			  ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {children}
    </Container>
  );
}
