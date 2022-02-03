import React, { useCallback, useEffect } from "react";
import { Letter, shuffle } from "../utils/game";
import { getTodaysLetters } from "../utils/generator";
import { SolutionBoard } from "../utils/words-helper";
import createPersistedState from "use-persisted-state";
import { PersistedStates } from "../constants/state";

const usePersistedLetters = createPersistedState(PersistedStates.Letters);
const [todaysBoard, todaysLetters] = getTodaysLetters();

type LettersOptions = {
  solutionBoard: SolutionBoard;
  letters: Letter[];
  shuffleLetters: () => void;
};

export const useLetters = (): LettersOptions => {
  const [letters, setLetters] = usePersistedLetters(todaysLetters) as [
    Letter[],
    React.Dispatch<Letter[]>,
  ];

  const shuffleLetters = useCallback(() => {
    setLetters(shuffle(letters));
  }, [letters]); // eslint-disable-line react-hooks/exhaustive-deps

  // This shuffles the letters when the page loads which is nice,
  // but more importantly it sets the letters into our persisted state.
  // This makes sure the board is synced up with
  useEffect(() => {
    shuffleLetters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    solutionBoard: todaysBoard,
    letters,
    shuffleLetters,
  };
};
