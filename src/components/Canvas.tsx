import styled from "@emotion/styled";
import { FC } from "react";
import { Board } from "./Board";

type CanvasProps = {};

export const Canvas: FC<CanvasProps> = () => {
  return (
    <Container id="canvas">
      <Board />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  min-height: 360px; // 6 tiles * tile size
  margin: 1% auto;
  overflow: hidden;
  touch-action: none;

  @media (max-height: 620px), (max-width: 370px) {
    min-height: 315px; // 6 tiles * tile size
  }

  @media (max-height: 580px) {
    min-height: 290px; // 6 tiles * tile size
  }
`;
