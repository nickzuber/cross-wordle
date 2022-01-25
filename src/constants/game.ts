import { Letter } from "../utils/game";

export const DragTypes = {
  Tile: "tile",
  BoardTile: "board-tile",
};

export type DragTileItem = {
  letter: Letter;
};

export type DragBoardTileItem = {
  letter: Letter;
  position: [number, number];
};
