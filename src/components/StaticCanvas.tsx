import React, { FC, useContext } from "react";
import styled from "@emotion/styled";
import { StaticBoardTile } from "./StaticBoardTile";
import { GameContext } from "../contexts/game";

type StaticCanvasProps = {};

export const StaticCanvas: FC<StaticCanvasProps> = () => {
  const { board } = useContext(GameContext);

  return (
    <Container id="canvas">
      <Board>
        {board.tiles.map((row) => {
          return (
            <StaticTileRow>
              {row.map((tile) => (
                <StaticBoardTile
                  key={tile.id}
                  row={tile.row}
                  col={tile.col}
                  letter={tile.letter}
                  tileState={tile.state}
                />
              ))}
            </StaticTileRow>
          );
        })}
      </Board>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  min-width: 360px; // 6 tiles * tile size
  max-width: 600px;
  width: calc(100% - 20px);
  max-height: 500px;
  flex: 10;
  margin: 12px auto;
  overflow: hidden;
  touch-action: none;
`;

const Board = styled.div`
  position: relative;
  background: #ffffff;
  width: 100%;
  height: 100%;
`;

const StaticTileRow = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
