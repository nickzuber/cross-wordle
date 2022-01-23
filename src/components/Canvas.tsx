import React, { FC } from "react";
import styled from "@emotion/styled";
import { useTrackpadPanning } from "../hooks/useTrackpadPanning";
import { useCamera } from "../hooks/useCamera";
import { Config } from "../utils/game";

type CanvasProps = {};

export const Canvas: FC<CanvasProps> = () => {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const { camera, panCamera } = useCamera();
  useTrackpadPanning(canvasRef, panCamera);

  const board = new Array(Config.MaxLetters)
    .fill(null)
    .map((_) => new Array(Config.MaxLetters).fill(null));

  const transform = `scale(${camera.z}) translate(${camera.x}px, ${camera.y}px)`;
  return (
    <Container id="canvas">
      <Wrapper ref={canvasRef}>
        <Board style={{ transform }}>
          {board.map((row, r) => {
            return row.map((tile, c) => <Tile row={r} col={c} />);
          })}
        </Board>
      </Wrapper>
    </Container>
  );
};

type Positioned = {
  row: number;
  col: number;
};

const Tile = styled.div<Positioned>`
  position: absolute;
  top: ${(p) => p.row * Config.TileSize + Config.TileSpacing}px;
  left: ${(p) => p.col * Config.TileSize + Config.TileSpacing}px;
  height: 50px;
  width: 50px;
  border: 2px solid #d3d6da;
  background: transparent;
`;

const Container = styled.div`
  position: relative;
  max-width: 600px;
  width: 100%;
  min-height: 200px;
  height: 80vh;
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
