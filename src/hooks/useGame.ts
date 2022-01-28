import React, { useCallback, useMemo, useState } from "react";
import { Board, Directions, GameState, Letter, TileState } from "../utils/game";
import { validateBoard, validateWordIsland } from "../utils/solver";
import { useBoard } from "./useBoard";
import { useLetters } from "./useLetters";

export type GameOptions = {
  gameState: GameState;
  board: Board;
  letters: Letter[];
  unusedLetters: Letter[];
  boardLetterIds: Set<string>;
  setLetterOnBoard: (letter: Letter) => void;
  shuffleLetters: () => void;
  requestFinish: () => void;
  clearBoard: () => void;
  flipCursorDirection: () => void;
  canFinish: boolean;
  updateCursor: (row: number, col: number) => void;
  backspaceBoard: () => void;
  shiftBoard: (direction: Directions) => void;
};

export const useGame = (): GameOptions => {
  const [gameState, setGameState] = useState(GameState.Playing);
  const { letters, shuffleLetters } = useLetters();
  const {
    board,
    setLetterOnBoard,
    resetBoard,
    setBoard,
    updateCursor,
    backspaceBoard,
    flipCursorDirection,
    shiftBoard,
  } = useBoard();

  const tilesAreConnected = React.useMemo(
    () => validateWordIsland(board),
    [board],
  );

  const boardLetterIds = React.useMemo(
    () =>
      new Set(
        board.tiles
          .map((row) => row.map((tile) => tile.letter))
          .flat()
          .filter((letter) => letter !== null)
          .map((letter) => (letter as Letter).id),
      ),
    [board],
  );

  const canFinish = useMemo(
    () => tilesAreConnected && boardLetterIds.size > 1,
    [tilesAreConnected, boardLetterIds],
  );

  const requestFinish = useCallback(() => {
    if (!tilesAreConnected) return;

    // Validate the board.
    const [newBoard] = validateBoard(board);

    // Animate the tiles.
    setBoard(newBoard);

    // Print the result.
    console.info(getEmojiBoard(newBoard));
    setGameState(GameState.Ended);
  }, [board, tilesAreConnected, setBoard]);

  const unusedLetters = letters.filter(
    (letter) => !boardLetterIds.has(letter.id),
  );

  return {
    board,
    letters,
    unusedLetters,
    boardLetterIds,
    setLetterOnBoard,
    shuffleLetters,
    requestFinish,
    clearBoard: resetBoard,
    canFinish,
    updateCursor,
    flipCursorDirection,
    backspaceBoard,
    shiftBoard,
    gameState,
  };
};

function getEmojiBoard(board: Board) {
  const boardString = board.tiles
    .map((row) => {
      return row
        .map((tile) => {
          switch (tile.state) {
            case TileState.VALID:
              return "🟩";
            case TileState.INVALID:
              return "⬛";
            case TileState.MIXED:
              return "🟨";
            case TileState.IDLE:
              return "⬜";
            default:
              return "";
          }
        })
        .join("");
    })
    .join("\n");

  return boardString;
}
