import React, { FC } from "react";
import styled from "@emotion/styled";
import { useTrackpadPanning } from "../hooks/useTrackpadPanning";
import { useCamera } from "../hooks/useCamera";
import { useBoard } from "../hooks/useBoard";
import { BoardTile } from "./BoardTile";

type CanvasProps = {};

export const Canvas: FC<CanvasProps> = () => {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const { camera, panCamera } = useCamera();
  const { board, setLetter } = useBoard();

  useTrackpadPanning(canvasRef, panCamera);

  const transform = `scale(${camera.z}) translate(${camera.x}px, ${camera.y}px)`;
  return (
    <Container id="canvas">
      <Wrapper ref={canvasRef}>
        <Board style={{ transform }}>
          {board.tiles.map((row) => {
            return row.map((tile) => (
              <BoardTile
                key={tile.id}
                row={tile.row}
                col={tile.col}
                letter={tile.letter}
                setLetter={setLetter}
              />
            ));
          })}
        </Board>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  max-width: 600px;
  width: 100%;
  min-height: 200px;
  flex: 8;
  margin: 12px auto;
  overflow: hidden;
`;

const Wrapper = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Board = styled.div`
  position: relative;
  background: #ffffff;
  width: 1200px;
  height: 1200px;
`;
