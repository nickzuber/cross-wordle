import { v4 as uuidv4 } from "uuid";
import generator from "random-seed";
import { Letter, shuffle } from "../utils/game";
import { words as TwoCharWords } from "../constants/words/two";
import { words as ThreeCharWords } from "../constants/words/three";
import { words as FourCharWords } from "../constants/words/four";
import { words as FiveCharWords } from "../constants/words/five";
import { words as SixCharWords } from "../constants/words/six";
import { words as dictionary } from "../constants/words";
import {
  createBoard,
  createTestingBoard,
  Direction,
  fillRandomEasyPosition,
  findEasyPositions,
  getLettersFromBoard,
  getWordsOfLength,
  printBoard,
  randomGenerator,
  SolutionBoard,
  writeWordToBoard,
} from "./solution";

export function createCompleteBoard(): SolutionBoard {
  console.clear();

  // Initialize scene.
  let board = createBoard();
  let direction = Direction.Right;

  // 1. Finding the first word.
  // Get the very first word. This is a special case.
  // We will always pick a longer word that goes across.
  const firstWordLength = randomGenerator.intBetween(5, 6);
  const potentialFirstWords = getWordsOfLength(firstWordLength);
  const firstStartingPosition = {
    row: randomGenerator.intBetween(0, 5),
    col: randomGenerator.intBetween(0, 6 - firstWordLength),
  };
  const firstWord = potentialFirstWords[randomGenerator.range(potentialFirstWords.length)];
  board = writeWordToBoard(firstWord, firstStartingPosition, direction, board);

  // 2. General Word Insertion Algorithm for adding new words to an existing board.
  board = fillRandomEasyPosition(board, true) || board;
  board = fillRandomEasyPosition(board) || board;
  board = fillRandomEasyPosition(board) || board;
  board = fillRandomEasyPosition(board) || board;
  board = fillRandomEasyPosition(board) || board;

  printBoard(
    board,
    findEasyPositions(board).map(([pos, _]) => pos),
  );

  return board;
}

export function getTodaysLetters(): Letter[] {
  const board = createCompleteBoard();
  const letters = getLettersFromBoard(board);
  console.info(letters);
  return shuffle(letters).map((letter) => ({ id: uuidv4(), letter }));
}
