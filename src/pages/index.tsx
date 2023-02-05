import styled from "styled-components";
import Container from "react-bootstrap/Container";

export default function Index() {
  return (
    <Container>
      <h3>Index</h3>
      <div>
        <div>
          <a href="/coffee">Drink Coffee Manage</a>
        </div>
        <div>
          <a href="/coffee/chart">Drink Coffee Chart</a>
        </div>
      </div>
    </Container>
  );
}
