import React, { useCallback } from "react";
import { Letter, shuffle } from "../utils/game";
import { getTodaysLetters } from "../utils/generator";

const todaysLetters = getTodaysLetters();

type LettersOptions = {
  letters: Letter[];
  addLetter: (letter: Letter) => void;
  removeLetter: (id: string) => void;
  setLetters: (fn: (letters: Letter[]) => Letter[]) => void;
  shuffleLetters: () => void;
};

export const useLetters = (): LettersOptions => {
  const [letters, setLetters] = React.useState(todaysLetters);

  const addLetter = useCallback((letter: Letter) => {
    setLetters((letters) => letters.concat(letter));
  }, []);

  const removeLetter = useCallback((id: string) => {
    setLetters((letters) => letters.filter((letter) => letter.id !== id));
  }, []);

  const publicSetLetters = useCallback((fn: (letters: Letter[]) => Letter[]) => {
    setLetters((letters) => fn(letters));
  }, []);

  const shuffleLetters = useCallback(() => {
    setLetters((letters) => shuffle(letters));
  }, []);

  return {
    letters,
    addLetter,
    removeLetter,
    setLetters: publicSetLetters,
    shuffleLetters,
  };
};
