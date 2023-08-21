import React, { useCallback } from "react";
import createPersistedState from "use-persisted-state";
import { v4 as uuidv4 } from "uuid";
import { PersistedStates } from "../constants/state";
import {
  Board,
  Config,
  CursorDirections,
  decrementCursor,
  Directions,
  getTileAtCursor,
  incrementCursor,
  Letter,
  moveBoard,
  ScoredBoard,
  TileChangeReason,
  TileState,
  updateCursorInDirection,
} from "../utils/game";

const usePersistedBoard = createPersistedState(PersistedStates.Board);
const defaultBoard = initalizeBoard();

type BoardOptions = {
  board: Board | ScoredBoard;
  setLetterOnBoard: (letter: Letter) => void;
  resetBoard: () => void;
  setBoard: (board: Board) => void;
  updateCursor: (row: number, col: number) => void;
  flipCursorDirection: () => void;
  backspaceBoard: () => void;
  shiftBoard: (direction: Directions) => void;
  moveCursorInDirection: (direction: Directions) => void;
};

export const useBoard = (): BoardOptions => {
  const [board, setBoard] = usePersistedBoard(defaultBoard) as [Board, React.Dispatch<Board>];

  const shiftBoard = useCallback(
    (direction: Directions) => {
      setBoard(moveBoard(board, direction));
    },
    [board], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const moveCursorInDirection = useCallback(
    (direction: Directions) => {
      setBoard(updateCursorInDirection(board, direction));
    },
    [board], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const setLetterOnBoard = useCallback(
    (letter: Letter) => {
      const { row, col } = board.cursor;
      const newCursor = incrementCursor(board);
      const newTiles = board.tiles.slice();

      // Set new tile.
      newTiles[row][col].letter = letter;
      newTiles[row][col].state = TileState.IDLE;
      newTiles[row][col].changeReason = TileChangeReason.LETTER;

      setBoard({ cursor: newCursor, tiles: newTiles });
    },
    [board], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const backspaceBoard = useCallback(() => {
    const { row, col } = board.cursor;
    const currentTileHasLetter = getTileAtCursor(board);

    // Letter on current tile, just delete it and move backwards like normal.
    if (currentTileHasLetter.letter) {
      const newCursor = decrementCursor(board);
      const newTiles = board.tiles.slice();

      // Set new tile.
      newTiles[row][col].letter = null;
      newTiles[row][col].state = TileState.IDLE;
      newTiles[row][col].changeReason = undefined;

      return setBoard({ cursor: newCursor, tiles: newTiles });
    }

    // No letter on current tile, we want to delete the letter before the next
    // decemented cursor.
    const newCursor = decrementCursor(board);
    const newTiles = board.tiles.slice();

    // Set new tile.
    newTiles[newCursor.row][newCursor.col].letter = null;
    newTiles[newCursor.row][newCursor.col].state = TileState.IDLE;
    newTiles[newCursor.row][newCursor.col].changeReason = undefined;

    setBoard({ cursor: newCursor, tiles: newTiles });
  }, [board]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetBoard = useCallback(() => {
    setBoard({
      ...board,
      tiles: board.tiles.map((row) =>
        row.map((tile) => ({ ...tile, letter: null, changeReason: undefined })),
      ),
    });
  }, [board]); // eslint-disable-line react-hooks/exhaustive-deps

  const publicSetBoard = useCallback(
    (board: Board) => setBoard(board),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const flipCursorDirection = useCallback(() => {
    setBoard({
      ...board,
      cursor: {
        ...board.cursor,
        direction:
          board.cursor.direction === CursorDirections.LeftToRight
            ? CursorDirections.TopToBottom
            : CursorDirections.LeftToRight,
      },
    });
  }, [board]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateCursor = useCallback(
    (row: number, col: number) => {
      if (board.cursor.row === row && board.cursor.col === col) {
        setBoard({
          ...board,
          cursor: {
            ...board.cursor,
            direction:
              board.cursor.direction === CursorDirections.LeftToRight
                ? CursorDirections.TopToBottom
                : CursorDirections.LeftToRight,
          },
        });
      } else {
        setBoard({
          ...board,
          cursor: {
            ...board.cursor,
            row,
            col,
          },
        });
      }
    },
    [board], // eslint-disable-line react-hooks/exhaustive-deps
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
    moveCursorInDirection,
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
      changeReason: undefined,
    })),
  );

  return { cursor: initalCursor, tiles };
}
