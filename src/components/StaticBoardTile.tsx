import { FC, useContext } from "react";
import styled from "@emotion/styled";
import { Config, Letter, TileState } from "../utils/game";
import { useDrag, useDrop } from "react-dnd";
import { DragBoardTileItem, DragTileItem, DragTypes } from "../constants/game";
import { GameContext } from "../contexts/game";

type PlacedTileProps = {
  row: number;
  col: number;
  hovered: boolean;
  letter: Letter;
  tileState: TileState;
};

type StaticBoardTileProps = {
  row: number;
  col: number;
  letter: Letter | null;
  tileState: TileState;
};

export const StaticBoardTile: FC<StaticBoardTileProps> = ({
  row,
  col,
  letter,
  tileState,
}) => {
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
        <PlacedTile
          letter={letter}
          row={row}
          col={col}
          hovered={isOver}
          tileState={tileState}
        />
      ) : (
        <Tile hovered={isOver}>{isOver ? item?.letter.letter : null}</Tile>
      )}
    </TileWrapper>
  );
};

const PlacedTile: FC<PlacedTileProps> = ({
  letter,
  row,
  col,
  hovered,
  tileState,
}) => {
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
      tileState={tileState}
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

type FilledTileProps = {
  dragged: boolean;
  tileState: TileState;
};

const TileWrapper = styled.div<TileProps>`
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

const Tile = styled.div<Hoverable>`
  border: 2px solid ${(p) => (p.hovered ? "#787c7e" : "#d3d6da")};
  background: ${(p) => (p.hovered ? "transparent" : "transparent")};
  color: #1a1a1b;
  min-height: 50px;
  min-width: 50px;
  max-height: 50px;
  max-width: 50px;
  height: calc(100% - 10px);
  width: calc(100% - 10px);
  opacity: ${(p) => (p.hovered ? 0.5 : 1)};
  font-weight: 700;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  // doesn't work
  &:before {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;

// Green   #6aaa64
// Yellow  #c9b458
// Grey    #787c7e

const FilledTile = styled(Tile)<FilledTileProps>`
  background: ${(p) =>
    p.tileState === TileState.VALID
      ? "#6aaa64"
      : p.tileState === TileState.INVALID
      ? "#787c7e"
      : p.tileState === TileState.MIXED
      ? "#c9b458"
      : "#ffffff"};
  border-color: ${(p) =>
    p.tileState === TileState.VALID
      ? "#6aaa64"
      : p.tileState === TileState.INVALID
      ? "#787c7e"
      : p.tileState === TileState.MIXED
      ? "#c9b458"
      : "#787c7e"};
  color: ${(p) =>
    p.tileState === TileState.VALID
      ? "#ffffff"
      : p.tileState === TileState.INVALID
      ? "#ffffff"
      : p.tileState === TileState.MIXED
      ? "#ffffff"
      : "#1a1a1b"};
  opacity: ${(p) => (p.dragged ? 0.5 : 1)};
`;
