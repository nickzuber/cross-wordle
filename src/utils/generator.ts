import { v4 as uuidv4 } from "uuid";
import { Config, Letter, shuffle } from "../utils/game";
import {
  countLettersonBoard,
  createBoard,
  Direction,
  fillRandomEasyPosition,
  fillRandomEmptyPositions,
  getLettersFromBoard,
  getWordsOfLength,
  printBoard,
  randomGenerator,
  SolutionBoard,
  writeWordToBoard,
} from "./words-helper";

export function createCompleteBoard(): SolutionBoard {
  // console.clear();

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

  printBoard(board);

  return board;
}

export function getTodaysLetters(): Letter[] {
  console.clear();
  const board = createCompleteBoard();
  const letters = getLettersFromBoard(board);
  console.info(letters);
  return shuffle(letters).map((letter) => ({ id: uuidv4(), letter }));
}

export function analyzeBoardBuildingPerformance(iters = 1000) {
  console.info("%cRunning board building performance...", "color: #ccc");
  const results = new Array(30).fill(0);
  for (let i = 0; i < iters; i++) {
    const b = createCompleteBoard();
    const letters = getLettersFromBoard(b);
    results[letters.length]++;
  }

  console.info(
    `%cLetter Frequency / ${iters} iterations`,
    "font-weight: 600; text-decoration: underline",
  );

  for (let i = 0; i < results.length; i++) {
    const freq = results[i];
    if (freq > 0) {
      console.info(`\t${i} →\t${((freq / iters) * 100).toFixed(2)}%`);
    }
  }

  console.info("%cComplete.", "color: #ccc");
}
