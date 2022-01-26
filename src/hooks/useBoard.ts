import React, { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Board,
  Config,
  CursorDirections,
  incrementCursor,
  Letter,
  TileState,
} from "../utils/game";

type BoardOptions = {
  board: Board;
  setLetterOnBoard: (letter: Letter) => void;
  resetBoard: () => void;
  setBoard: (board: Board) => void;
};

export const useBoard = (): BoardOptions => {
  const [board, setBoard] = React.useState(initalizeBoard());

  const setLetterOnBoard = useCallback(
    (letter: Letter) => {
      setBoard((board) => {
        const { row, col } = board.cursor;
        const newCursor = incrementCursor(board);
        const newTiles = board.tiles.slice();

        // Set new tile.
        newTiles[row][col].letter = letter;
        newTiles[row][col].state = TileState.IDLE;

        return { cursor: newCursor, tiles: newTiles };
      });
    },
    [board.cursor],
  );

  const resetBoard = useCallback(() => {
    setBoard((board) => ({
      ...board,
      tiles: board.tiles.map((row) =>
        row.map((tile) => ({ ...tile, letter: null })),
      ),
    }));
  }, []);

  const publicSetBoard = useCallback((board: Board) => setBoard(board), []);

  return {
    board,
    setLetterOnBoard,
    resetBoard,
    setBoard: publicSetBoard,
  };
};

function initalizeBoard(): Board {
  const initalCursor = {
    row: 0,
    col: 0,
    direction: CursorDirections.LeftToRight,
  };

  const tiles = new Array(Config.TileCount).fill(null).map((_, row) =>
    new Array(Config.TileCount).fill(null).map((_, col) => ({
      id: uuidv4(),
      row,
      col,
      letter: null,
      state: TileState.IDLE,
    })),
  );

  return { cursor: initalCursor, tiles };
}
