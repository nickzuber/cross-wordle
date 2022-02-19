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
import { ToastContext } from "../contexts/toast";

const useIsGameOver = createPersistedState(PersistedStates.GameOver);
const useHardMode = createPersistedState(PersistedStates.HardMode);

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
  getShareLink: () => string;
  shiftBoard: (direction: Directions) => void;
  moveCursorInDirection: (direction: Directions) => void;
};

export const useGame = (): GameOptions => {
  const { openStats } = useContext(ModalsContext);
  const { clearToast } = useContext(ToastContext);
  const [isGameOver, setIsGameOver] = useIsGameOver(false);
  const [hardMode] = useHardMode(false);
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

  const canFinish = useMemo(() => {
    if (hardMode) {
      return tilesAreConnected && boardLetterIds.size === Config.MaxLetters;
    } else {
      return tilesAreConnected && boardLetterIds.size > 5;
    }
  }, [hardMode, tilesAreConnected, boardLetterIds]);

  const requestFinish = useCallback(() => {
    if (!canFinish) return;
    clearToast();

    // Validate the board.
    const [newBoard] = validateBoard(board);

    // Animate the tiles.
    setBoard(newBoard);

    // End the game.
    setIsGameOver(true);

    // Show the stats modal.
    setTimeout(openStats, 2000);
  }, [board, canFinish, clearToast]); // eslint-disable-line react-hooks/exhaustive-deps

  const unusedLetters = letters.filter((letter) => !boardLetterIds.has(letter.id));

  const getShareLink = useCallback(() => {
    return [
      `Crosswordle ${getPuzzleNumber()} ${countValidLettersOnBoard(board)}/${
        Config.MaxLetters
      }`,
      "",
      getEmojiBoard(board),
    ].join("\n");
  }, [board]);

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
    getShareLink,
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
              return "🟩";
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
