import { FC } from "react";
import styled from "@emotion/styled";
import { Board } from "./Board";

type StaticCanvasProps = {};

export const StaticCanvas: FC<StaticCanvasProps> = () => {
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
  margin: 12px auto;
  overflow: hidden;
  touch-action: none;
`;
