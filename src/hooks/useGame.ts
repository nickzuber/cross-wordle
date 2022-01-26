import React, { useCallback, useMemo } from "react";
import { Board, Letter } from "../utils/game";
import { validateBoard, validateWordIsland } from "../utils/solver";
import { useBoard } from "./useBoard";
import { useLetters } from "./useLetters";

export type GameOptions = {
  board: Board;
  letters: Letter[];
  unusedLetters: Letter[];
  boardLetterIds: Set<string>;
  setLetterOnBoard: (position: [number, number], letter: Letter | null) => void;
  shuffleLetters: () => void;
  requestFinish: () => void;
  clearBoard: () => void;
  getEmojiBoard: () => void;
  canFinish: boolean;
};

export const useGame = (): GameOptions => {
  const { letters, shuffleLetters } = useLetters();
  const { board, setLetterOnBoard, resetBoard, setBoard } = useBoard();

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

  const getEmojiBoard = useCallback(() => {
    const boardString = board.tiles
      .map((row) => {
        return row
          .map((tile) => {
            return tile.letter ? "🟩" : "⬜";
          })
          .join("");
      })
      .join("\n");

    return boardString;
  }, [board]);

  const requestFinish = useCallback(() => {
    if (!tilesAreConnected) return;

    const [newBoard, isValidBoard] = validateBoard(board);
    setBoard(newBoard);
    if (isValidBoard) {
      setTimeout(() => alert(getEmojiBoard()), 2000);
    }
  }, [board, tilesAreConnected, setBoard, getEmojiBoard]);

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
    getEmojiBoard,
    requestFinish,
    clearBoard: resetBoard,
    canFinish,
  };
};
