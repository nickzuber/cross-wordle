import React, { FC, useContext } from "react";
import styled from "@emotion/styled";
import { useTrackpadPanning } from "../hooks/useTrackpadPanning";
import { useCamera } from "../hooks/useCamera";
import { BoardTile } from "./BoardTile";
import { GameContext } from "../contexts/game";
import { useTouchPanning } from "../hooks/useTouchPanning";

type CanvasProps = {};

export const Canvas: FC<CanvasProps> = () => {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const { camera, zoomCamera, panCamera, panCameraTo } = useCamera();
  const { board } = useContext(GameContext);

  useTrackpadPanning(canvasRef, zoomCamera, panCamera);
  useTouchPanning(canvasRef, camera, zoomCamera, panCameraTo);

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
  max-height: 500px;
  flex: 10;
  margin: 0 auto;
  overflow: hidden;
  touch-action: none;
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
  transform-origin: top left;
`;
