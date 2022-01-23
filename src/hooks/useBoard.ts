import React, { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Board, Config, Letter, Tile } from "../utils/game";

type BoardOptions = {
  board: Board;
  setLetter: (position: [number, number], letter: Letter | null) => void;
};

export const useBoard = (): BoardOptions => {
  const [board, setBoard] = React.useState(initalizeBoard());

  const setLetter = useCallback(
    (position: [number, number], letter: Letter | null) => {
      setBoard((board) => {
        const [row, col] = position;
        const newTiles = board.tiles.slice();

        // Set new tile.
        newTiles[row][col].letter = letter;

        return { tiles: newTiles };
      });
    },
    [],
  );

  return {
    board,
    setLetter,
  };
};

function initalizeBoard(): Board {
  const tiles = new Array(Config.TileCount).fill(null).map((_, row) =>
    new Array(Config.TileCount).fill(null).map(
      (_, col) =>
        ({
          id: uuidv4(),
          row,
          col,
          letter: null,
        } as Tile),
    ),
  );

  return { tiles };
}
