import React, { useCallback, useContext, useMemo } from "react";
import { Board, Config, Directions, getPuzzleNumber, Letter, TileState } from "../utils/game";
import {
  countValidLettersOnBoard,
  validateBoard,
  validateWordIsland,
} from "../utils/board-validator";
import { useBoard } from "./useBoard";
import { useLetters } from "./useLetters";
import { SolutionBoard } from "../utils/words-helper";
import createPersistedState from "use-persisted-state";
import { PersistedStates } from "../constants/state";
import { ModalsContext } from "../contexts/modals";

const useIsGameOver = createPersistedState(PersistedStates.GameOver);

export type GameOptions = {
  solutionBoard: SolutionBoard;
  isGameOver: boolean;
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
  moveCursorInDirection: (direction: Directions) => void;
};

export const useGame = (): GameOptions => {
  const { openStats } = useContext(ModalsContext);
  const [isGameOver, setIsGameOver] = useIsGameOver(false);
  const { letters, solutionBoard, shuffleLetters } = useLetters();
  const {
    board,
    setLetterOnBoard,
    resetBoard,
    setBoard,
    updateCursor,
    backspaceBoard,
    flipCursorDirection,
    shiftBoard,
    moveCursorInDirection,
  } = useBoard();

  const tilesAreConnected = React.useMemo(() => validateWordIsland(board), [board]);

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
    if (!canFinish) return;

    // Validate the board.
    const [newBoard] = validateBoard(board);

    // Animate the tiles.
    setBoard(newBoard);

    // Print the result.
    const shareString = [
      `Cross Wordle ${getPuzzleNumber()} ${countValidLettersOnBoard(newBoard)}/${
        Config.MaxLetters
      }`,
      "",
      getEmojiBoard(newBoard),
    ].join("\n");
    console.info(shareString);
    setIsGameOver(true);
    setTimeout(openStats, 1600);
  }, [board, canFinish]); // eslint-disable-line react-hooks/exhaustive-deps

  const unusedLetters = letters.filter((letter) => !boardLetterIds.has(letter.id));

  return {
    solutionBoard,
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
    moveCursorInDirection,
    isGameOver: isGameOver as boolean,
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
