import React, { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Board, Config, Letter } from "../utils/game";
import { useBoard } from "./useBoard";
import { useLetters } from "./useLetters";

export type GameOptions = {
  board: Board;
  letters: Letter[];
  unusedLetters: Letter[];
  boardLetterIds: Set<string>;
  setLetterOnBoard: (position: [number, number], letter: Letter | null) => void;
};

export const useGame = (): GameOptions => {
  const { letters, addLetter, removeLetter } = useLetters();
  const { board, setLetterOnBoard } = useBoard();

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
  };
};
