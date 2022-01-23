import React, { useCallback } from "react";
import { Board, Letter } from "../utils/game";
import { useBoard } from "./useBoard";
import { useLetters } from "./useLetters";

export type GameOptions = {
  board: Board;
  letters: Letter[];
  unusedLetters: Letter[];
  boardLetterIds: Set<string>;
  setLetterOnBoard: (position: [number, number], letter: Letter | null) => void;
  shareBoard: () => void;
};

export const useGame = (): GameOptions => {
  const { letters } = useLetters();
  const { board, setLetterOnBoard } = useBoard();

  const shareBoard = useCallback(() => {
    const boardString = board.tiles
      .map((row) => {
        return row
          .map((tile) => {
            return tile.letter ? "🟩" : "⬜";
          })
          .join("");
      })
      .join("\n");

    console.info(boardString);
  }, [board]);

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

  const unusedLetters = letters.filter(
    (letter) => !boardLetterIds.has(letter.id),
  );

  return {
    board,
    letters,
    unusedLetters,
    boardLetterIds,
    setLetterOnBoard,
    shareBoard,
  };
};
