import React, { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Config, getRandomLetters, Letter } from "../utils/game";

type LettersOptions = {
  letters: Letter[];
  addLetter: (letter: Letter) => void;
  removeLetter: (id: string) => void;
  setLetters: (fn: (letters: Letter[]) => Letter[]) => void;
};

export const useLetters = (): LettersOptions => {
  const [letters, setLetters] = React.useState(getInitialLetters());

  const addLetter = useCallback((letter: Letter) => {
    setLetters((letters) => letters.concat(letter));
  }, []);

  const removeLetter = useCallback((id: string) => {
    setLetters((letters) => letters.filter((letter) => letter.id !== id));
  }, []);

  const publicSetLetters = useCallback(
    (fn: (letters: Letter[]) => Letter[]) => {
      setLetters((letters) => fn(letters));
    },
    [],
  );

  return {
    letters,
    addLetter,
    removeLetter,
    setLetters: publicSetLetters,
  };
};

function getInitialLetters(): Letter[] {
  const letters = getRandomLetters(Config.MaxLetters);
  return letters.map((letter) => ({ id: uuidv4(), letter }));
}
