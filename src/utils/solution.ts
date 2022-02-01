import generator from "random-seed";
import { words as TwoCharWords } from "../constants/words/good-words/two";
import { words as ThreeCharWords } from "../constants/words/good-words/three";
import { words as FourCharWords } from "../constants/words/good-words/four";
import { words as FiveCharWords } from "../constants/words/good-words/five";
import { words as SixCharWords } from "../constants/words/good-words/six";
import { words as dictionary } from "../constants/words";
import { Config } from "./game";

// 2D board of letters being used.
export type SolutionBoard = string[][];

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
const seed = `${date.getMonth()}${date.getDate()}${date.getFullYear()}`;
// export const randomGenerator = generator.create(seed);
export const randomGenerator = generator.create();

export function createBoard(): SolutionBoard {
  return [[], [], [], [], [], []];
}

export function createTestingBoard(): SolutionBoard {
  return [
    [undefined, "c", "h", "a", "f", "f"] as unknown as string[],
    [undefined, "i", undefined, undefined, "l", "i"] as unknown as string[],
    [undefined, "r", undefined, undefined, "y", "e"] as unknown as string[],
    [undefined, "c"] as unknown as string[],
    [undefined, "a"] as unknown as string[],
    [],
  ];
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

export function getAllLettersInRow(position: Position, board: SolutionBoard): [string, Position][] {
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

export function countLettersonBoard(board: SolutionBoard) {
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

    console.info(`[fillRandomEasyPosition #${i}]`, intersection, direction);

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

  console.info("Unable to find any valid easy positions to fill.");
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
  const currentLetters = countLettersonBoard(board);
  const lettersRemaining = MaxLetters - currentLetters;

  if (lettersRemaining < 3) {
    console.info(`Only ${lettersRemaining} letters left, skipping any placements`);
    return board;
  }

  const maxLettersBeforeIntersection = intersection.row;
  const maxLettersAfterIntersection = LetterBounds - intersection.row - 1;

  // Get letters that are in this row at the intersection point.
  const originalLetters = getAllLettersInColumn(intersection, board);
  const normalizedLetters = originalLetters.map(([letter, position]) => {
    return [letter, moveDown(position, -originalLetters[0][1].row)] as [string, Position];
  });

  // We're going to attempt to fit a word with all permutations of the avaiabile
  // letters in the column.
  const lettersBFS = [originalLetters];

  while (lettersBFS.filter((letters) => letters.length > 0).length > 0) {
    // Guarenteed to exist because of this loop's condition
    const letters = lettersBFS.pop() as [string, Position][];
    console.info("Attempting to fit letters", letters);

    // How long would the word be if we fit all the letters on the column.
    const lengthOfFittingAllLetters =
      letters.length > 1 ? letters[letters.length - 1][1].row - letters[0][1].row + 1 : 1;

    if (lengthOfFittingAllLetters > lettersRemaining) {
      lettersBFS.push(removeLeftItem(letters));
      lettersBFS.push(removeRightItem(letters));
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
        console.info("[down] No words fit this criteria", intersection, wordLengthAttempt);
        continue;
      }

      const candidateWordOffset = randomGenerator.range(candidateWords.length);
      for (let offset = 0; offset < candidateWords.length; offset++) {
        const word = candidateWords[(candidateWordOffset + offset) % candidateWords.length];
        const startingPosition = moveDown(
          intersection,
          -word.indexOf(board[intersection.row][intersection.col]),
        );

        try {
          const newBoard = writeWordToBoard(word, startingPosition, Direction.Down, board);

          if (validateSolutionBoard(newBoard)) {
            console.info("new word added:", word);
            return newBoard;
          }
        } catch (e) {
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
  const currentLetters = countLettersonBoard(board);
  const lettersRemaining = MaxLetters - currentLetters;

  if (lettersRemaining < 3) {
    console.info(`Only ${lettersRemaining} letters left, skipping any placements`);
    return board;
  }

  const maxLettersBeforeIntersection = intersection.col;
  const maxLettersAfterIntersection = LetterBounds - intersection.col - 1;

  // Get letters that are in this col at the intersection point.
  const originalLetters = getAllLettersInRow(intersection, board);

  // We're going to attempt to fit a word with all permutations of the avaiabile
  // letters in the column.
  const lettersBFS = [originalLetters];

  while (lettersBFS.filter((letters) => letters.length > 0).length > 0) {
    // Guarenteed to exist because of this loop's condition
    const letters = lettersBFS.pop() as [string, Position][];
    const normalizedLetters = letters.map(([letter, position]) => {
      return [letter, moveRight(position, -letters[0][1].col)] as [string, Position];
    });
    console.info("Attempting to fit letters", letters, normalizedLetters);

    // How long would the word be if we fit all the letters on the column.
    const lengthOfFittingAllLetters =
      letters.length > 1 ? letters[letters.length - 1][1].col - letters[0][1].col + 1 : 1;

    if (lengthOfFittingAllLetters > lettersRemaining) {
      lettersBFS.push(removeLeftItem(letters));
      lettersBFS.push(removeRightItem(letters));
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
        console.info("[right] No words fit this criteria", intersection, wordLengthAttempt);
        continue;
      }

      const candidateWordOffset = randomGenerator.range(candidateWords.length);
      for (let offset = 0; offset < candidateWords.length; offset++) {
        const word = candidateWords[(candidateWordOffset + offset) % candidateWords.length];
        const startingPosition = moveRight(
          intersection,
          -word.indexOf(board[intersection.row][intersection.col]),
        );

        try {
          const newBoard = writeWordToBoard(word, startingPosition, Direction.Right, board);

          if (validateSolutionBoard(newBoard)) {
            console.info("new word added:", word);
            return newBoard;
          }
        } catch (e) {
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
