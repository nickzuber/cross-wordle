import { FC } from "react";
import styled from "@emotion/styled";
import { Config, Letter } from "../utils/game";
import { useDrag, useDrop } from "react-dnd";
import {
  DragBoardTileItem,
  DragTileItem,
  DragTypes,
} from "../constants.ts/game";

type PlacedTileProps = {
  row: number;
  col: number;
  hovered: boolean;
  letter: Letter;
};

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
    accept: [DragTypes.Tile, DragTypes.BoardTile],
    drop(item: DragTileItem | DragBoardTileItem, monitor) {
      console.info(item, monitor.getItemType());

      switch (monitor.getItemType()) {
        // Set new tile.
        case DragTypes.Tile:
          setLetter([row, col], item.letter);
          break;
        // If this tile came from the board, we need to remove it from it's old position.
        case DragTypes.BoardTile:
          const [prevRow, prevCol] = (item as DragBoardTileItem).position;
          setLetter([prevRow, prevCol], null);
          setLetter([row, col], item.letter);
          break;
      }

      if (monitor.getItemType() === DragTypes.BoardTile) {
      }
    },
    collect: (monitor) => ({
      item: monitor.getItem(),
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  return (
    <TileWrapper ref={drop} row={row} col={col}>
      {letter && !isOver ? (
        <PlacedTile letter={letter} row={row} col={col} hovered={isOver} />
      ) : (
        <Tile hovered={isOver}>
          <Tag>{row * 10 + col + 1}</Tag>
          {isOver ? item?.letter.letter : null}
        </Tile>
      )}
    </TileWrapper>
  );
};

const PlacedTile: FC<PlacedTileProps> = ({ letter, row, col, hovered }) => {
  const [collected, drag, dragPreview] = useDrag(() => ({
    type: DragTypes.BoardTile,
    item: { letter, position: [row, col] },
  }));

  return (
    <FilledTile ref={drag} {...collected} hovered={hovered}>
      <Tag>{row * 10 + col + 1}</Tag>
      {letter.letter}
    </FilledTile>
  );
};

type TileProps = {
  row: number;
  col: number;
};

type Hoverable = {
  hovered: boolean;
};

const TileWrapper = styled.div<TileProps>`
  position: absolute;
  top: ${(p) => p.row * Config.TileSize + Config.TileSpacing}px;
  left: ${(p) => p.col * Config.TileSize + Config.TileSpacing}px;
  height: 60px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Tile = styled.div<Hoverable>`
  border: 2px solid ${(p) => (p.hovered ? "#d3d6da" : "#d3d6da")};
  background: ${(p) => (p.hovered ? "#d3d6da88" : "transparent")};
  height: 50px;
  width: 50px;
  font-weight: 700;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
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
