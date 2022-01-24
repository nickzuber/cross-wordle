import { FC, useContext } from "react";
import styled from "@emotion/styled";
import { Config, Letter } from "../utils/game";
import { useDrag, useDrop } from "react-dnd";
import {
  DragBoardTileItem,
  DragTileItem,
  DragTypes,
} from "../constants.ts/game";
import { GameContext } from "../contexts/game";

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
};

export const BoardTile: FC<BoardTileProps> = ({ row, col, letter }) => {
  const { setLetterOnBoard } = useContext(GameContext);

  const [{ item, isOver }, drop] = useDrop(() => ({
    accept: [DragTypes.Tile, DragTypes.BoardTile],
    drop(item: DragTileItem | DragBoardTileItem, monitor) {
      console.info(item, monitor.getItemType());

      switch (monitor.getItemType()) {
        // Set new tile.
        case DragTypes.Tile:
          setLetterOnBoard([row, col], item.letter);
          break;
        // If this tile came from the board, we need to remove it from it's old position.
        case DragTypes.BoardTile:
          const [prevRow, prevCol] = (item as DragBoardTileItem).position;
          setLetterOnBoard([prevRow, prevCol], null);
          setLetterOnBoard([row, col], item.letter);
          break;
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
          {/* <Tag>{row * 10 + col + 1}</Tag> */}
          {isOver ? item?.letter.letter : null}
        </Tile>
      )}
    </TileWrapper>
  );
};

const PlacedTile: FC<PlacedTileProps> = ({ letter, row, col, hovered }) => {
  const [{ draggedItem }, drag] = useDrag(() => ({
    type: DragTypes.BoardTile,
    item: { letter, position: [row, col] },
    collect: (monitor) => ({
      draggedItem: monitor.getItem() as
        | DragTileItem
        | DragBoardTileItem
        | undefined,
    }),
  }));

  const isBeingDragged = draggedItem?.letter.id === letter.id;

  return (
    <FilledTile
      ref={drag}
      className="placed-tile"
      hovered={hovered}
      dragged={isBeingDragged}
    >
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

type Dragable = {
  dragged: boolean;
};

const TileWrapper = styled.div<TileProps>`
  position: absolute;
  top: ${(p) => p.row * Config.TileSize + Config.TileSpacing}px;
  left: ${(p) => p.col * Config.TileSize + Config.TileSpacing}px;
  height: ${Config.TileSize}px;
  width: ${Config.TileSize}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Tile = styled.div<Hoverable>`
  border: 2px solid ${(p) => (p.hovered ? "#787c7e" : "#d3d6da")};
  background: ${(p) => (p.hovered ? "transparent" : "transparent")};
  height: ${Config.TileSize - Config.TileSpacing}px;
  width: ${Config.TileSize - Config.TileSpacing}px;
  opacity: ${(p) => (p.hovered ? 0.5 : 1)};
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

const FilledTile = styled(Tile)<Dragable>`
  background: #ffffff;
  border-color: #787c7e;
  opacity: ${(p) => (p.dragged ? 0.5 : 1)};
`;

// const Tag = styled.div`
//   position: absolute;
//   top: 6px;
//   left: 7px;
//   font-size: 8px;
//   font-weight: 500;
//   opacity: 0.2;
// `;
