import styled from "styled-components";
import Container from "react-bootstrap/Container";
import Link from 'next/link'

export default function Index() {
  return (
    <Container>
      <h3>Index</h3>
      <div>
        <div>
          <Link href="/coffee">Drink Coffee Manage</Link>
        </div>
        <div>
          <Link href="/coffee/chart">Drink Coffee Chart</Link>
        </div>
      </div>
    </Container>
  );
}
