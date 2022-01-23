import { FC } from "react";
import styled from "@emotion/styled";
import { Config, Letter } from "../utils/game";
import { useDrop } from "react-dnd";
import { DragTypes } from "../constants.ts/game";
import { useBoard } from "../hooks/useBoard";

type BoardTileProps = {
  row: number;
  col: number;
  letter: Letter | null;
  setLetter: (position: [number, number], letter: Letter | null) => void;
};

export const BoardTile: FC<BoardTileProps> = ({
  row,
  col,
  letter,
  setLetter,
}) => {
  const [{ item, isOver }, drop] = useDrop(() => ({
    accept: DragTypes.Tile,
    drop(item: Letter, monitor) {
      console.info(item, monitor);
      setLetter([row, col], item);
    },
    collect: (monitor) => ({
      item: monitor.getItem(),
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return letter && !isOver ? (
    <FilledTile ref={drop} row={row} col={col} hovered={isOver}>
      <Tag>{row * 10 + col + 1}</Tag>
      {letter.letter}
    </FilledTile>
  ) : (
    <Tile ref={drop} row={row} col={col} hovered={isOver}>
      <Tag>{row * 10 + col + 1}</Tag>
      {isOver ? item?.letter : null}
    </Tile>
  );
};

type TileProps = {
  row: number;
  col: number;
  hovered: boolean;
};

const Tile = styled.div<TileProps>`
  position: absolute;
  top: ${(p) => p.row * Config.TileSize + Config.TileSpacing}px;
  left: ${(p) => p.col * Config.TileSize + Config.TileSpacing}px;
  height: 50px;
  width: 50px;
  border: 2px solid ${(p) => (p.hovered ? "#d3d6da" : "#d3d6da")};
  background: ${(p) => (p.hovered ? "#d3d6da88" : "transparent")};
  font-weight: 700;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Green   #6aaa64
// Yellow  #c9b458
// Grey    #787c7e

const FilledTile = styled(Tile)`
  background: #c9b458;
  border-color: #c9b458;
  color: #ffffff;
`;

const Tag = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  font-size: 8px;
  font-weight: 500;
  opacity: 0.1;
`;
