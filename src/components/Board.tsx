import { FC, useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Letter, Tile, TileState } from "../utils/game";
import { Reveal, PopIn } from "../constants/animations";
import { GameContext } from "../contexts/game";

type GridTileProps = {
  tile: Tile;
  hasCursor: boolean;
};

export const Board: FC = () => {
  const { board } = useContext(GameContext);

  return (
    <Container>
      {board.tiles.map((row) => {
        const rowId = row.map(({ id }) => id).join(",");
        return (
          <Row key={rowId}>
            {row.map((tile) => (
              <GridTile
                key={tile.id}
                tile={tile}
                hasCursor={
                  board.cursor.row === tile.row && board.cursor.col === tile.col
                }
              />
            ))}
          </Row>
        );
      })}
    </Container>
  );
};

const GridTile: FC<GridTileProps> = ({ tile, hasCursor }) => {
  return (
    <TileWrapper>
      <TileContents hasCursor={hasCursor}>{tile.letter?.letter}</TileContents>
    </TileWrapper>
  );
};

const Container = styled.div`
  position: relative;
  background: #ffffff;
  width: 360px; // 6 tiles * tile size
  height: 360px;
`;

const Row = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TileWrapper = styled.div`
  position: relative;
  min-height: 60px;
  min-width: 60px;
  max-height: 60px;
  max-width: 60px;
  height: 100%;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const TileContents = styled.div<{ hasCursor: boolean }>`
  border: 2px solid ${(p) => (p.hasCursor ? "red" : "#d3d6da")};
  background: transparent;
  color: #1a1a1b;
  min-height: 50px;
  min-width: 50px;
  max-height: 50px;
  max-width: 50px;
  height: calc(100% - 10px);
  width: calc(100% - 10px);
  opacity: 1;
  font-weight: 700;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`;
