import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Board, Config, Letter } from "../utils/game";
import { useBoard } from "./useBoard";
import { useLetters } from "./useLetters";

export type GameOptions = {
  board: Board;
  letters: Letter[];
  setLetter: (position: [number, number], letter: Letter | null) => void;
};

export const useGame = (): GameOptions => {
  const { letters, addLetter, removeLetter } = useLetters();
  const { board, setLetter } = useBoard();

  // effect that manages letters on board changes

  return {
    board,
    letters,
    setLetter,
  };
};
