import { v4 as uuidv4 } from "uuid";
import { Config, Letter, shuffle } from "../utils/game";
import {
  Direction,
  SolutionBoard,
  countLettersOnBoard,
  createBoard,
  fillRandomEasyPosition,
  fillRandomEmptyPositions,
  getLettersFromBoard,
  getWordsOfLength,
  randomGenerator,
  writeWordToBoard,
} from "./words-helper";

export function createCompleteBoard(): SolutionBoard {
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
  //
  // This raises the success rate of building a board w/ all 20 characters
  // by a whopping ~3%
  board = fillRandomEasyPosition(board, true) || board;

  // Try a few times to fill out the board as much as we can.
  // It should never take more than 15 tries before we fill up.
  // This is just a safe arbitrary buffer.
  for (let pass = 0; pass < 15; pass++) {
    const newBoard = fillRandomEasyPosition(board) || board;
    if (newBoard) board = newBoard;
    else break; // We're not able to add any more word normally.
  }

  const currentLetters = countLettersOnBoard(board);
  const lettersRemaining = Config.MaxLetters - currentLetters;
  for (let i = 0; i < lettersRemaining; i++) {
    board = fillRandomEmptyPositions(board) || board;
  }

  return board;
}

export function getTodaysLetters(): [SolutionBoard, Letter[]] {
  // Create a board in one attempt.
  let board = createCompleteBoard();
  let letters = getLettersFromBoard(board);

  // There is a ~80% chance that any board we build will have all 20 letters.
  // When that relatively low chance hits where we have fewer letters than 20,
  // that board can be discarded and we can just try again.
  // The odds of the board having fewer than 20 letters more than 10 times in
  // a row is like, a really small number, so we should be fine.
  //
  // In a simulation where we generated 1,000 boards, the worst case scenario
  // took 6 attempts to build a board successfully, and this only happened a
  // handful of times in that entire simulation. Keep in mind we only generate
  // 1 board a day.
  //
  // So a cap of 10 attempts should be more than enough. So I make it 15 so we
  // can all sleep easy at night.
  for (let tries = 0; tries < 15; tries++) {
    if (letters.length === 20) break;
    board = createCompleteBoard();
    letters = getLettersFromBoard(board);
  }

  const shuffledLetters = shuffle(letters).map((letter) => ({ id: uuidv4(), letter }));
  return [board, shuffledLetters];
}

export function analyzeBoardBuildingPerformance(iters = 1000) {
  console.info("%cRunning board building performance...", "color: #aaa");
  const start = Date.now();
  const results = new Array(15).fill(0);

  for (let i = 0; i < iters; i++) {
    let x = 0;
    let board;
    let letters = [];
    for (let tries = 0; tries < 15; tries++) {
      if (letters.length === 20) break;
      board = createCompleteBoard();
      letters = getLettersFromBoard(board);
      x++;
    }
    results[x]++;
  }
  const end = Date.now();

  console.info(
    `%cBoard building attempts until success / ${iters} iterations`,
    "font-weight: 600; text-decoration: underline",
  );

  for (let i = 0; i < results.length; i++) {
    const freq = results[i];
    if (freq > 0) {
      console.info(`\t${i} →\t${((freq / iters) * 100).toFixed(2)}%`);
    }
  }

  console.info(`%cDone in ${((end - start) / 1000).toFixed(2)}s`, "color: #aaa");
}
