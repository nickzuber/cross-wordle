import generator from "random-seed";
import { words as dictionary } from "../constants/words";
import { words as goodDictionary } from "../constants/words/good-words";
import { words as FiveCharWords } from "../constants/words/good-words/five";
import { words as FourCharWords } from "../constants/words/good-words/four";
import { words as SixCharWords } from "../constants/words/good-words/six";
import { words as ThreeCharWords } from "../constants/words/good-words/three";
import { words as TwoCharWords } from "../constants/words/good-words/two";
import { Config } from "./game";

const debug = false;
const log = debug ? console.info : (args: any[]): void => {};
const logError = debug ? console.error : (args: any[]): void => {};

// 2D board of letters being used.
export type SolutionBoard = string[][];

export type ScoredSolutionLetter = { letter: string; score: number };
export type ScoredSolutionBoard = ScoredSolutionLetter[][];

// Position on the board.
export type Position = {
  row: number;
  col: number;
};

// Direction of the word being generated.
export enum Direction {
  Down = "down",
  Right = "right",
}

// Board is restricted to 6x6 grid.
export const LetterBounds = Config.TileCount;

// Max amount of letters we want on the board.
export const MaxLetters = Config.MaxLetters;

// Create the seeded random number generator for the day.
const date = new Date();
export const seed = `${date.getMonth()}${date.getDate()}${date.getFullYear()}`;
export const randomGenerator = generator.create(seed);

// @DEBUGGING
// This is a random generator.
// Just used for testing purposes.
// export const randomGenerator = generator.create();

export function createBoard(): SolutionBoard {
  return [[], [], [], [], [], []];
}

// @DEBUGGING
// This function is used debugging. It easily allows us to start with a board
// that we might have seen issues with before.
//
// 02/01/2022
// The last usage of this was for that evil "isbn" bug... *shivers*
export function createTestingBoard(): SolutionBoard {
  return [
    [undefined, undefined, undefined, undefined, "h", undefined] as unknown as string[],
    [undefined, undefined, undefined, "m", "o", "m"] as unknown as string[],
    ["c", "r", "u", "i", "s", "e"] as unknown as string[],
    ["r", undefined, undefined, "s", "e", "t"] as unknown as string[],
    ["u", undefined, undefined, "t", undefined, "a"] as unknown as string[],
    ["d", "o", undefined, undefined, undefined, "l"] as unknown as string[],
  ];
}

export function validateSolutionBoardWithGoodWords(board: SolutionBoard): boolean {
  // Get all words going left to right.
  const leftToRight = getWordsFromBoardLTR(board);

  // Get all words going top to bottom.
  const topToBottom = getWordsFromBoardTTB(board);

  // Collect all the words together.
  const foundWords = leftToRight.concat(topToBottom);

  // Validate entire board (easier this way).
  let allWordsAreValid = foundWords.every((word) => goodDictionary.has(word));
  return allWordsAreValid;
}

export function validateSolutionBoard(board: SolutionBoard): boolean {
  // Get all words going left to right.
  const leftToRight = getWordsFromBoardLTR(board);

  // Get all words going top to bottom.
  const topToBottom = getWordsFromBoardTTB(board);

  // Collect all the words together.
  const foundWords = leftToRight.concat(topToBottom);

  // Validate entire board (easier this way).
  let allWordsAreValid = foundWords.every((word) => dictionary.has(word));
  return allWordsAreValid;
}

function getWordsFromBoardLTR(board: SolutionBoard): string[] {
  return board
    .map((row) => {
      const words: string[] = [];
      let current: string | null = null;

      for (const letter of row) {
        // Initialize.
        if (!current && letter) {
          current = letter;
          continue;
        }

        // Append the new character.
        if (current && letter) {
          current += letter;
          continue;
        }

        // Complete the word.
        if (current && !letter) {
          words.push(current);
          current = null;
          continue;
        }
      }

      // Flush the `current`
      if (current) {
        words.push(current);
      }

      return words;
    })
    .flat()
    .filter((word) => word.length > 1);
}

function getWordsFromBoardTTB(board: SolutionBoard): string[] {
  const words: string[] = [];

  for (let c = 0; c < board[0].length; c++) {
    let current: string | null = null;

    for (let r = 0; r < board.length; r++) {
      const letter = board[r][c];

      // Initialize.
      if (!current && letter) {
        current = letter;
        continue;
      }

      // Append the new character.
      if (current && letter) {
        current += letter;
        continue;
      }

      // Complete the word.
      if (current && !letter) {
        words.push(current);
        current = null;
        continue;
      }
    }

    // Flush the `current`
    if (current) {
      words.push(current);
    }
  }

  return words.flat().filter((word) => word.length > 1);
}

export function getWordsOfLength(length: number): string[] {
  switch (length) {
    case 2:
      return TwoCharWords;
    case 3:
      return ThreeCharWords;
    case 4:
      return FourCharWords;
    case 5:
      return FiveCharWords;
    case 6:
      return SixCharWords;
  }

  return [];
}

export function writeWordToBoard(
  word: string,
  position: Position,
  direction: Direction,
  board: SolutionBoard,
): SolutionBoard {
  const newBoard = createBoard();

  const willBoardOverflow =
    direction === Direction.Right
      ? position.col + word.length - 1 >= LetterBounds
      : position.row + word.length - 1 >= LetterBounds;

  const willBoardUnderflow =
    direction === Direction.Right ? position.col < 0 : position.row < 0;

  // Make sure writing to this board is valid.
  if (willBoardOverflow || willBoardUnderflow) throw new Error("Invalid board.");

  for (let r = 0; r < LetterBounds; r++) {
    for (let c = 0; c < LetterBounds; c++) {
      newBoard[r][c] = board[r][c];
    }
  }

  const chars = word.split("");
  for (let i = 0; i < word.length; i++) {
    if (direction === Direction.Right) {
      newBoard[position.row][position.col + i] = chars[i];
    } else {
      newBoard[position.row + i][position.col] = chars[i];
    }
  }

  return newBoard;
}

export function getAllLettersInRow(
  position: Position,
  board: SolutionBoard,
): [string, Position][] {
  const letters = [];
  for (let c = 0; c < LetterBounds; c++) {
    const letter = board[position.row][c];
    if (letter) {
      letters.push([letter, { row: position.row, col: c }] as [string, Position]);
    }
  }

  return letters;
}

export function getAllLettersInColumn(
  position: Position,
  board: SolutionBoard,
): [string, Position][] {
  const letters = [];
  for (let r = 0; r < LetterBounds; r++) {
    const letter = board[r][position.col];
    if (letter) {
      letters.push([letter, { row: r, col: position.col }] as [string, Position]);
    }
  }

  return letters;
}

export function getLettersFromBoard(board: SolutionBoard) {
  return board.flat().flat().filter(Boolean);
}

export function countLettersOnBoard(board: SolutionBoard) {
  return board.flat().flat().filter(Boolean).length;
}

export function moveRight(position: Position, dx: number): Position {
  return {
    row: position.row,
    col: position.col + dx,
  };
}

export function moveDown(position: Position, dy: number): Position {
  return {
    row: position.row + dy,
    col: position.col,
  };
}

export function boardAt(board: SolutionBoard) {
  return (row: number, col: number) => {
    const r = board[row];
    return r ? r[col] : undefined;
  };
}

// True if everything is true.
export function all<T>(vals: T[]): boolean {
  return vals.every(Boolean);
}

// True if everything is false.
export function none<T>(vals: T[]): boolean {
  return vals.every((val) => !val);
}

// Positions are "empty" when they contain no letters and connects to the
// existing board. We don't care about direction here since it's
// just a single character.
export function findEmptyPositions(board: SolutionBoard): Position[] {
  const positions: Position[] = [];
  const at = boardAt(board);

  for (let r = 0; r < LetterBounds; r++) {
    for (let c = 0; c < LetterBounds; c++) {
      const letter = board[r][c];
      if (letter) continue;

      // - X -
      // X O X
      // - X -
      const n = at(r - 1, c);
      const e = at(r, c + 1);
      const s = at(r + 1, c);
      const w = at(r, c - 1);

      if (n || e || s || w) {
        positions.push({ row: r, col: c });
      }
    }
  }

  return positions;
}

// Positions of "easy" letters on the board that will give us the least amount
// of issues when trying to add another word to the board.
// The direction paired with the position is the direction which a word
// that wants to use this position should go in.
export function findEasyPositions(board: SolutionBoard): [Position, Direction][] {
  const positions: [Position, Direction][] = [];
  const at = boardAt(board);

  for (let r = 0; r < LetterBounds; r++) {
    for (let c = 0; c < LetterBounds; c++) {
      const letter = board[r][c];
      if (!letter) continue;

      // X X X
      // X O X
      // X X X
      const n = at(r - 1, c);
      const ne = at(r - 1, c + 1);
      const e = at(r, c + 1);
      const se = at(r + 1, c + 1);
      const s = at(r + 1, c);
      const sw = at(r + 1, c - 1);
      const w = at(r, c - 1);
      const nw = at(r - 1, c - 1);

      // - X -
      // - O -
      // - X -
      if (all([n, s]) && none([ne, se, nw, sw, e, w])) {
        const item: [Position, Direction] = [{ row: r, col: c }, Direction.Right];
        positions.push(item);
      }

      // - - -
      // X O X
      // - - -
      if (all([e, w]) && none([ne, se, nw, sw, n, s])) {
        const item: [Position, Direction] = [{ row: r, col: c }, Direction.Down];
        positions.push(item);
      }

      // - - -
      // - O X
      // - - /
      if (all([e]) && none([w, ne, nw, sw, n, s])) {
        const item: [Position, Direction] = [{ row: r, col: c }, Direction.Down];
        positions.push(item);
      }

      // - - /
      // - O X
      // - - -
      if (all([e]) && none([w, se, nw, sw, n, s])) {
        const item: [Position, Direction] = [{ row: r, col: c }, Direction.Down];
        positions.push(item);
      }

      // / - -
      // X O -
      // - - -
      if (all([w]) && none([e, ne, se, sw, n, s])) {
        const item: [Position, Direction] = [{ row: r, col: c }, Direction.Down];
        positions.push(item);
      }

      // - - -
      // X O -
      // / - -
      if (all([w]) && none([e, ne, se, nw, n, s])) {
        const item: [Position, Direction] = [{ row: r, col: c }, Direction.Down];
        positions.push(item);
      }

      // - - -
      // - O -
      // / X -
      if (all([n]) && none([e, ne, se, nw, w, s])) {
        const item: [Position, Direction] = [{ row: r, col: c }, Direction.Right];
        positions.push(item);
      }

      // / X -
      // - O -
      // - - -
      if (all([s]) && none([e, ne, se, sw, w, n])) {
        const item: [Position, Direction] = [{ row: r, col: c }, Direction.Right];
        positions.push(item);
      }
    }
  }

  return positions;
}

export function fillRandomEmptyPositions(board: SolutionBoard): SolutionBoard | null {
  let emptyPositions = findEmptyPositions(board);

  const letters = [
    "q",
    "w",
    "e",
    "r",
    "t",
    "y",
    "u",
    "i",
    "o",
    "p",
    "a",
    "s",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "z",
    "x",
    "c",
    "v",
    "b",
    "n",
    "m",
  ];

  // Attempt to fill each empty position with a letter until we find one
  // that fits into the board validly.
  const start = randomGenerator.range(emptyPositions.length);
  for (let i = 0; i < emptyPositions.length; i++) {
    const index = (start + i) % emptyPositions.length;
    const position = emptyPositions[index];

    log(`[fillRandomEmptyPositions #${i + 1}]`, position);

    for (let j = 0; j < letters.length; j++) {
      const index = (start + j) % letters.length;
      const letter = letters[index];

      try {
        const newBoard = writeWordToBoard(letter, position, Direction.Right, board);
        if (validateSolutionBoardWithGoodWords(newBoard)) {
          log("new letter added:", letter, position);
          return newBoard;
        }
      } catch (error) {
        logError("[Filling empty positions]", letter, position);
      }
    }
  }

  log("Unable to find any valid empty positions to fill.");
  return null;
}

export function fillRandomEasyPosition(
  board: SolutionBoard,
  preferLongWord = false,
): SolutionBoard | null {
  let easyPositions = findEasyPositions(board);
  let updatedBoard: SolutionBoard | null = null;

  // Attempt to fill each easy position we find until we succeed.
  const start = randomGenerator.range(easyPositions.length);
  for (let i = 0; i < easyPositions.length; i++) {
    const index = (start + i) % easyPositions.length;
    const [intersection, direction] = easyPositions[index];

    log(`[fillRandomEasyPosition #${i + 1}]`, intersection, direction);

    switch (direction) {
      case Direction.Down:
        updatedBoard = placeWordDownwardsAt(intersection, board, preferLongWord);
        break;
      case Direction.Right:
        updatedBoard = placeWordRightwardsAt(intersection, board, preferLongWord);
        break;
    }

    // We were able to place a word at an easy position.
    if (updatedBoard) {
      return updatedBoard;
    }
  }

  log("Unable to find any valid easy positions to fill.");
  return null;
}

function removeLeftItem<T>(arr: T[]): T[] {
  return arr.filter((_, i) => i !== 0);
}

function removeRightItem<T>(arr: T[]): T[] {
  return arr.filter((_, i) => i !== arr.length - 1);
}

function createRange(min: number, max: number): number[] {
  const range = [];
  for (let i = min; i <= max; i++) {
    range.push(i);
  }
  return range;
}

export function placeWordDownwardsAt(
  intersection: Position,
  board: SolutionBoard,
  preferLongWord = false,
): SolutionBoard | null {
  const currentLetters = countLettersOnBoard(board);
  const lettersRemaining = MaxLetters - currentLetters;

  if (lettersRemaining < 3) {
    log(`Only ${lettersRemaining} letters left, skipping any placements`);
    return null;
  }

  // Get letters that are in this row at the intersection point.
  const originalLetters = getAllLettersInColumn(intersection, board);

  // We're going to attempt to fit a word with all permutations of the avaiabile
  // letters in the column.
  const lettersBFS = [originalLetters];
  let __i = 0;

  while (lettersBFS.length > 0) {
    // Guarenteed to exist because of this loop's condition
    const letters = lettersBFS.pop() as [string, Position][];
    const normalizedLetters = originalLetters.map(([letter, position]) => {
      return [letter, moveDown(position, -originalLetters[0][1].row)] as [string, Position];
    });

    // Active intersection refers to the "pivot" letter currently on the board
    // that we're building this word around.
    // Initially, the intersection is the starting input to the function `intersection`
    // but once we start to try to fit the word to different combinations of letters
    // within this column, the "active intersection" will always just be the top-most
    // letter.
    const activeIntersection = letters[0][1];

    const maxLettersBeforeIntersection = intersection.row;
    const maxLettersAfterIntersection = LetterBounds - intersection.row - 1;

    log(`\t${++__i} Attempting to fit letters`, letters, normalizedLetters);

    // How long would the word be if we fit all the letters on the column.
    const lengthOfFittingAllLetters =
      letters.length > 1 ? letters[letters.length - 1][1].row - letters[0][1].row + 1 : 1;

    // Always try to find solutions for omitting edge letters.
    // If we find a solution before then we'll have exited early.
    const leftBranch = removeLeftItem(letters);
    const rightBranch = removeRightItem(letters);
    if (leftBranch.length > 0) lettersBFS.push(leftBranch);
    if (rightBranch.length > 0) lettersBFS.push(rightBranch);

    // If the length of fitting all these letters is longer than how many letters
    // we have remaining, we know already that this won't work, so we can skip.
    if (lengthOfFittingAllLetters > lettersRemaining) {
      continue;
    }

    // Min length of a word is either 3 (2 is too boring) or the length required
    // to fit all letters in the column.
    const minLength =
      letters.length > 1 ? letters[letters.length - 1][1].row - letters[0][1].row + 1 : 3;

    // Max length of a word is either 6 or the amount of letters we have left
    // to fill the board, assuming its more than 1.
    const maxLength = Math.min(lettersRemaining, 6);

    const range = createRange(minLength, maxLength);
    const length = preferLongWord
      ? randomGenerator.intBetween(maxLength - 1, maxLength)
      : randomGenerator.intBetween(minLength, maxLength);
    const startingIndex = range.indexOf(length);

    for (let offset = 0; offset < range.length; offset++) {
      const wordLengthAttempt = range[(startingIndex + offset) % range.length];

      // Find all possible words that fit the letters criteria & the word length.
      const candidateWords = getWordsOfLength(wordLengthAttempt).filter((word) => {
        const positionOfFirstLetter = word.indexOf(normalizedLetters[0][0]);
        if (positionOfFirstLetter < 0) return false;
        const allLettersFitInWord = normalizedLetters.every(([letter, position]) => {
          return word.indexOf(letter) - positionOfFirstLetter === position.row;
        });
        if (!allLettersFitInWord) return false;

        const positions = letters.map(([letter]) => word.indexOf(letter));
        const lettersBeforeIntersetion = Math.min(...positions);
        const lettersAfterIntersetion = word.length - 1 - Math.max(...positions);

        return (
          lettersBeforeIntersetion <= maxLettersBeforeIntersection &&
          lettersAfterIntersetion <= maxLettersAfterIntersection
        );
      });

      if (candidateWords.length === 0) {
        log("[down] No words fit this criteria", activeIntersection, wordLengthAttempt);
        continue;
      }

      const candidateWordOffset = randomGenerator.range(candidateWords.length);
      for (let offset = 0; offset < candidateWords.length; offset++) {
        const word = candidateWords[(candidateWordOffset + offset) % candidateWords.length];
        const startingPosition = moveDown(
          activeIntersection,
          -word.indexOf(board[activeIntersection.row][activeIntersection.col]),
        );

        try {
          const newBoard = writeWordToBoard(word, startingPosition, Direction.Down, board);

          if (validateSolutionBoard(newBoard)) {
            log("new word added:", word);
            return newBoard;
          }
        } catch (error) {
          logError("[Filling easy Down]", word, startingPosition);
          // Skip
          // This is because the word when placed in its starting position
          // spills outside of the board.
          // FWIW we can probably calculate this ahead of time.
        }
      }
    }
  }

  return null;
}

export function placeWordRightwardsAt(
  intersection: Position,
  board: SolutionBoard,
  preferLongWord = false,
): SolutionBoard | null {
  const currentLetters = countLettersOnBoard(board);
  const lettersRemaining = MaxLetters - currentLetters;

  if (lettersRemaining < 3) {
    log(`Only ${lettersRemaining} letters left, skipping any placements`);
    return null;
  }

  // Get letters that are in this col at the intersection point.
  const originalLetters = getAllLettersInRow(intersection, board);

  // We're going to attempt to fit a word with all permutations of the avaiabile
  // letters in the column.
  const lettersBFS = [originalLetters];
  let __i = 0;

  while (lettersBFS.length > 0) {
    // Guarenteed to exist because of this loop's condition
    const letters = lettersBFS.pop() as [string, Position][];
    const normalizedLetters = letters.map(([letter, position]) => {
      return [letter, moveRight(position, -letters[0][1].col)] as [string, Position];
    });

    // Active intersection refers to the "pivot" letter currently on the board
    // that we're building this word around.
    // Initially, the intersection is the starting input to the function `intersection`
    // but once we start to try to fit the word to different combinations of letters
    // within this row, the "active intersection" will always just be the left-most
    // letter.
    const activeIntersection = letters[0][1];

    const maxLettersBeforeIntersection = activeIntersection.col;
    const maxLettersAfterIntersection = LetterBounds - activeIntersection.col - 1;

    log(`\t${++__i} Attempting to fit letters`, letters, normalizedLetters);

    // How long would the word be if we fit all the letters on the column.
    const lengthOfFittingAllLetters =
      letters.length > 1 ? letters[letters.length - 1][1].col - letters[0][1].col + 1 : 1;

    // Always try to find solutions for omitting edge letters.
    // If we find a solution before then we'll have exited early.
    const leftBranch = removeLeftItem(letters);
    const rightBranch = removeRightItem(letters);
    if (leftBranch.length > 0) lettersBFS.push(leftBranch);
    if (rightBranch.length > 0) lettersBFS.push(rightBranch);

    // If the length of fitting all these letters is longer than how many letters
    // we have remaining, we know already that this won't work, so we can skip.
    if (lengthOfFittingAllLetters > lettersRemaining) {
      continue;
    }

    // Min length of a word is either 3 (2 is too boring) or the length required
    // to fit all letters in the column.
    const minLength =
      letters.length > 1 ? letters[letters.length - 1][1].col - letters[0][1].col + 1 : 3;

    // Max length of a word is either 6 or the amount of letters we have left
    // to fill the board, assuming its more than 1.
    const maxLength = Math.min(lettersRemaining, 6);

    const range = createRange(minLength, maxLength);
    const length = preferLongWord
      ? randomGenerator.intBetween(maxLength - 1, maxLength)
      : randomGenerator.intBetween(minLength, maxLength);
    const startingIndex = range.indexOf(length);

    for (let offset = 0; offset < range.length; offset++) {
      const wordLengthAttempt = range[(startingIndex + offset) % range.length];

      // Find all possible words that fit the letters criteria & the word length.
      const candidateWords = getWordsOfLength(wordLengthAttempt).filter((word) => {
        const positionOfFirstLetter = word.indexOf(normalizedLetters[0][0]);
        if (positionOfFirstLetter < 0) return false;
        const allLettersFitInWord =
          normalizedLetters.length > 1
            ? normalizedLetters.every(([letter, position]) => {
                return word.indexOf(letter) - positionOfFirstLetter === position.col;
              })
            : true;
        if (!allLettersFitInWord) return false;
        const positions = letters.map(([letter]) => word.indexOf(letter));
        const lettersBeforeIntersetion = Math.min(...positions);
        const lettersAfterIntersetion = word.length - 1 - Math.max(...positions);

        return (
          lettersBeforeIntersetion <= maxLettersBeforeIntersection &&
          lettersAfterIntersetion <= maxLettersAfterIntersection
        );
      });

      if (candidateWords.length === 0) {
        log("[right] No words fit this criteria", activeIntersection, wordLengthAttempt);
        continue;
      }

      const candidateWordOffset = randomGenerator.range(candidateWords.length);
      for (let offset = 0; offset < candidateWords.length; offset++) {
        const word = candidateWords[(candidateWordOffset + offset) % candidateWords.length];
        const startingPosition = moveRight(
          activeIntersection,
          -word.indexOf(board[activeIntersection.row][activeIntersection.col]),
        );

        try {
          const newBoard = writeWordToBoard(word, startingPosition, Direction.Right, board);

          if (validateSolutionBoard(newBoard)) {
            log("new word added:", word);
            return newBoard;
          }
        } catch (error) {
          logError("[Filling easy Right]", word, startingPosition);
          // Skip
          // This is because the word when placed in its starting position
          // spills outside of the board.
          // FWIW we can probably calculate this ahead of time.
        }
      }
    }
  }

  return null;
}

export function printBoard(board: SolutionBoard, highlights: Position[] = []) {
  console.info("");
  const lines = ["\x1b[37m    0 1 2 3 4 5", "\x1b[37m  ┏━━━━━━━━━━━━━┓"];
  for (let r = 0; r < LetterBounds; r++) {
    let parts = [];
    for (let c = 0; c < LetterBounds; c++) {
      const highlight = highlights.find((p) => p.row === r && p.col === c);
      const letter = board[r][c]?.toUpperCase();
      if (highlight && letter) {
        parts.push(`\x1b[31m${letter}`);
      } else if (letter) {
        parts.push(`\x1b[30m${letter}`);
      } else {
        parts.push(`\x1b[37m🬀`);
      }
    }
    parts.push(`\x1b[37m┃`);
    lines.push(`\x1b[37m${r} ┃ ${parts.join(" ")}`);
  }
  lines.push("\x1b[37m  ┗━━━━━━━━━━━━━┛");
  console.info(lines.join("\n"));
  console.info("");
}
