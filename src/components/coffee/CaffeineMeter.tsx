import ProgressBar from "react-bootstrap/ProgressBar";
import styled from "styled-components";

const PBarArea = styled.div`
  width: 30vw;
  margin: 5px;
`;

export interface CaffeineMeterProps {
  mg: number;
  label: string;
}
export default function CaffeineMeter(props: CaffeineMeterProps) {
  return (
    <PBarArea>
      <ProgressBar now={props.mg} label={props.label} />
    </PBarArea>
  );
}
