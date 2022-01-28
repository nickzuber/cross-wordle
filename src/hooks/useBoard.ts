import React, { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Board,
  Config,
  CursorDirections,
  decrementCursor,
  Directions,
  incrementCursor,
  Letter,
  moveBoard,
  TileState,
} from "../utils/game";

type BoardOptions = {
  board: Board;
  setLetterOnBoard: (letter: Letter) => void;
  resetBoard: () => void;
  setBoard: (board: Board) => void;
  updateCursor: (row: number, col: number) => void;
  flipCursorDirection: () => void;
  backspaceBoard: () => void;
  shiftBoard: (direction: Directions) => void;
};

export const useBoard = (): BoardOptions => {
  const [board, setBoard] = React.useState(initalizeBoard());

  const shiftBoard = useCallback((direction: Directions) => {
    setBoard((board) => moveBoard(board, direction));
  }, []);

  const setLetterOnBoard = useCallback((letter: Letter) => {
    setBoard((board) => {
      const { row, col } = board.cursor;
      const newCursor = incrementCursor(board);
      const newTiles = board.tiles.slice();

      // Set new tile.
      newTiles[row][col].letter = letter;
      newTiles[row][col].state = TileState.IDLE;

      return { cursor: newCursor, tiles: newTiles };
    });
  }, []);

  const backspaceBoard = useCallback(() => {
    setBoard((board) => {
      const { row, col } = board.cursor;
      const newCursor = decrementCursor(board);
      const newTiles = board.tiles.slice();

      // Set new tile.
      newTiles[row][col].letter = null;
      newTiles[row][col].state = TileState.IDLE;

      return { cursor: newCursor, tiles: newTiles };
    });
  }, []);

  const resetBoard = useCallback(() => {
    setBoard((board) => ({
      ...board,
      tiles: board.tiles.map((row) =>
        row.map((tile) => ({ ...tile, letter: null })),
      ),
    }));
  }, []);

  const publicSetBoard = useCallback((board: Board) => setBoard(board), []);

  const flipCursorDirection = useCallback(() => {
    setBoard((board) => ({
      ...board,
      cursor: {
        ...board.cursor,
        direction:
          board.cursor.direction === CursorDirections.LeftToRight
            ? CursorDirections.TopToBottom
            : CursorDirections.LeftToRight,
      },
    }));
  }, [setBoard]);

  const updateCursor = useCallback(
    (row: number, col: number) => {
      setBoard((board) => {
        if (board.cursor.row === row && board.cursor.col === col) {
          return {
            ...board,
            cursor: {
              ...board.cursor,
              direction:
                board.cursor.direction === CursorDirections.LeftToRight
                  ? CursorDirections.TopToBottom
                  : CursorDirections.LeftToRight,
            },
          };
        } else {
          return {
            ...board,
            cursor: {
              ...board.cursor,
              row,
              col,
            },
          };
        }
      });
    },
    [setBoard],
  );

  return {
    board,
    setLetterOnBoard,
    resetBoard,
    setBoard: publicSetBoard,
    updateCursor,
    flipCursorDirection,
    backspaceBoard,
    shiftBoard,
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
