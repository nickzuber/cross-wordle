import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Config, getRandomLetters, Letter } from "../utils/game";

type LettersOptions = {
  letters: Letter[];
};

export const useLetters = (): LettersOptions => {
  const [letters, setLetters] = React.useState(getInitialLetters());

  return {
    letters,
  };
};

function getInitialLetters(): Letter[] {
  const letters = getRandomLetters(Config.MaxLetters);
  return letters.map((letter) => ({ id: uuidv4(), letter }));
}
