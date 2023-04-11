import styled from "styled-components";
import Container from "react-bootstrap/Container";
import Link from 'next/link'

export default function Index() {
  return (
    <Container>
      <h3>Index</h3>
      <div>
        <div>
          <Link href="/coffee">Input</Link>
        </div>
        <div>
          <Link href="/coffee/chart">Chart</Link>
        </div>
		<div>
          <Link href="/coffee/calendar">Calendar</Link>
        </div>
      </div>
    </Container>
  );
}
