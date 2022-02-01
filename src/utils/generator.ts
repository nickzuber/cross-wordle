import { v4 as uuidv4 } from "uuid";
import { Config, Letter, shuffle } from "../utils/game";
import {
  countLettersonBoard,
  createBoard,
  Direction,
  fillRandomEasyPosition,
  fillRandomEmptyPositions,
  findEasyPositions,
  getLettersFromBoard,
  getWordsOfLength,
  printBoard,
  randomGenerator,
  SolutionBoard,
  writeWordToBoard,
} from "./words-helper";

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
  // Do one pass that prefers longer words.
  // This helps ensure a healthy board is made.
  board = fillRandomEasyPosition(board, true) || board;

  // Try a few times to fill out the board as much as we can.
  // It should never take more than 10 tries before we fill up.
  // This is just a safe arbitrary buffer.
  for (let pass = 0; pass < 10; pass++) {
    const newBoard = fillRandomEasyPosition(board) || board;
    if (newBoard) board = newBoard;
    else break; // We're not able to add any more word normally.
  }

  const currentLetters = countLettersonBoard(board);
  const lettersRemaining = Config.MaxLetters - currentLetters;
  for (let i = 0; i < lettersRemaining; i++) {
    board = fillRandomEmptyPositions(board) || board;
  }

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
  return letters.map((letter) => ({ id: uuidv4(), letter }));
}
