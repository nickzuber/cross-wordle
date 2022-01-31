import { v4 as uuidv4 } from "uuid";
import generator from "random-seed";
import { Letter, shuffle } from "../utils/game";
import { words as TwoCharWords } from "../constants/words/two";
import { words as ThreeCharWords } from "../constants/words/three";
import { words as FourCharWords } from "../constants/words/four";
import { words as FiveCharWords } from "../constants/words/five";
import { words as SixCharWords } from "../constants/words/six";
import { words as dictionary } from "../constants/words";

// 2D board of letters being used.
type SolutionBoard = string[][];

// Position on the board.
type Position = {
  row: number;
  col: number;
};

// Direction of the word being generated.
enum Direction {
  Down = "down",
  Right = "right",
}

// Board is restricted to 6x6 grid.
const LetterBounds = 6;

// Create the seeded random number generator for the day.
const date = new Date();
const seed = `${date.getMonth()}${date.getDate()}${date.getFullYear()}`;
// const randomGenerator = generator.create(seed);
const randomGenerator = generator.create();

function createBoard(): SolutionBoard {
  return [[], [], [], [], [], []];
}

function getWordsOfLength(length: number): string[] {
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

// @TODO this could be improved by first finding all empty cells on that board,
// and randomly selecting one of those.
function getRandomPosition(board: SolutionBoard): Position {
  for (let i = 0; i < 100; i++) {
    const row = randomGenerator.intBetween(0, 5);
    const col = randomGenerator.intBetween(0, 5);
    if (!board[row][col]) {
      return { row, col };
    }
  }

  throw new Error("Unable to find random position on board.");
}

function findRandomLetterOnBoard(board: SolutionBoard): Position {
  let positions: Position[] = [];
  for (let r = 0; r < LetterBounds; r++) {
    for (let c = 0; c < LetterBounds; c++) {
      if (board[r][c]) {
        positions.push({ row: r, col: c });
      }
    }
  }

  return positions[randomGenerator.range(positions.length)];
}

function writeWordToBoard(
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

function getAllLettersInRow(position: Position, board: SolutionBoard): [string, Position][] {
  const letters = [];
  for (let c = 0; c < LetterBounds; c++) {
    const letter = board[position.row][c];
    if (letter) {
      letters.push([letter, { row: position.row, col: c }] as [string, Position]);
    }
  }

  return letters;
}

function getAllLettersInColumn(position: Position, board: SolutionBoard): [string, Position][] {
  const letters = [];
  for (let r = 0; r < LetterBounds; r++) {
    const letter = board[r][position.col];
    if (letter) {
      letters.push([letter, { row: r, col: position.col }] as [string, Position]);
    }
  }

  return letters;
}

function getAllLettersInDirection(direction: Direction, position: Position, board: SolutionBoard) {
  if (direction === Direction.Down) {
    return getAllLettersInColumn(position, board);
  } else {
    return getAllLettersInRow(position, board);
  }
}

function getLettersFromBoard(board: SolutionBoard) {
  return board.flat().flat().filter(Boolean);
}

function countLettersonBoard(board: SolutionBoard) {
  return board.flat().flat().filter(Boolean).length;
}

function moveX(position: Position, dx: number): Position {
  return {
    row: position.row,
    col: position.col + dx,
  };
}

function moveY(position: Position, dy: number): Position {
  return {
    row: position.row + dy,
    col: position.col,
  };
}

function boardAt(board: SolutionBoard) {
  return (row: number, col: number) => {
    const r = board[row];
    return r ? r[col] : undefined;
  };
}

// True if everything is true.
function all<T>(vals: T[]): boolean {
  return vals.every(Boolean);
}

// True if everything is false.
function none<T>(vals: T[]): boolean {
  return vals.every((val) => !val);
}

// Positions of "easy" letters on the board that will give us the least amount
// of issues when trying to add another word to the board.
// The direction paired with the position is the direction which a word
// that wants to use this position should go in.
function findEasyPositions(board: SolutionBoard): [Position, Direction][] {
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
      // - - -
      if (all([e]) && none([w, ne, se, nw, sw, n, s])) {
        const item: [Position, Direction] = [{ row: r, col: c }, Direction.Down];
        positions.push(item);
      }

      // - - -
      // X O -
      // - - -
      if (all([w]) && none([e, ne, se, nw, sw, n, s])) {
        const item: [Position, Direction] = [{ row: r, col: c }, Direction.Down];
        positions.push(item);
      }

      // - - -
      // - O -
      // - X -
      if (all([n]) && none([e, ne, se, nw, sw, w, s])) {
        const item: [Position, Direction] = [{ row: r, col: c }, Direction.Right];
        positions.push(item);
      }

      // - X -
      // - O -
      // - - -
      if (all([s]) && none([e, ne, se, nw, sw, w, n])) {
        const item: [Position, Direction] = [{ row: r, col: c }, Direction.Right];
        positions.push(item);
      }
    }
  }

  return positions;
}

function getWordsAndLetters(): [string[], string[]] {
  console.clear();

  // Initialize scene.
  let board = createBoard();
  let direction = Direction.Right;

  // 1. Finding the first word.
  // Get the very first word. This is a special case.
  // We will always pick a longer word that goes across.
  const firstWordLength = 6; // randomGenerator.intBetween(5, 6);
  const potentialFirstWords = getWordsOfLength(firstWordLength);
  const firstStartingPosition = {
    row: 5, //randomGenerator.intBetween(0, 5),
    col: randomGenerator.intBetween(0, 6 - firstWordLength),
  };
  const firstWord = potentialFirstWords[randomGenerator.range(potentialFirstWords.length)];
  board = writeWordToBoard(firstWord, firstStartingPosition, direction, board);

  // 2. General Word Insertion Algorithm for adding new words to an existing board.
  const words = [firstWord];

  let easyPositions = findEasyPositions(board);
  for (let i = 0; i < 3; i++) {
    const [intersection, newDirection] = easyPositions[randomGenerator.range(easyPositions.length)];
    direction = newDirection;

    if (direction === Direction.Down) {
      const maxLettersBeforeIntersection = intersection.row;
      const maxLettersAfterIntersection = LetterBounds - intersection.row - 1;

      // Special case, if this is the second word, prefer longer words.
      const length = i === 0 ? randomGenerator.intBetween(5, 6) : randomGenerator.intBetween(3, 6);

      const candidateWords = getWordsOfLength(length).filter((word) => {
        const pos = word.indexOf(board[intersection.row][intersection.col]);
        if (pos < 0) return false;
        const lettersBeforeIntersetion = pos;
        const lettersAfterIntersetion = word.length - 1 - pos;

        return (
          lettersBeforeIntersetion <= maxLettersBeforeIntersection &&
          lettersAfterIntersetion <= maxLettersAfterIntersection
        );
      });

      if (candidateWords.length === 0) {
        console.info("NO WORDS FIT WITH THIS CRITERIA", intersection, length);
        continue;
      }

      for (let tries = 0; tries < candidateWords.length; tries++) {
        const word = candidateWords[randomGenerator.range(candidateWords.length)];
        const startingPosition = moveY(
          intersection,
          -word.indexOf(board[intersection.row][intersection.col]),
        );
        const newBoard = writeWordToBoard(word, startingPosition, direction, board);

        if (validateBoard(newBoard)) {
          board = newBoard;
          words.push(word);
          break;
        } else {
          console.info(word, "failed to fit at", startingPosition, intersection);
        }
      }
    } else if (direction === Direction.Right) {
      // @todo
      console.info("SKIPPING");
    }

    easyPositions = findEasyPositions(board);
  }

  printBoard(
    board,
    easyPositions.map(([pos, _]) => pos),
  );

  const letters = getLettersFromBoard(board);
  return [words, letters];
}

function validateBoard(board: SolutionBoard): boolean {
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

// function getWordsAndLetters(): string[] {
//   const first = randomGenerator.range(SixCharWords.length);
//   const second = randomGenerator.range(FiveCharWords.length);
//   const third = randomGenerator.range(FiveCharWords.length);
//   const fourth = randomGenerator.range(FiveCharWords.length);
//   const fifth = randomGenerator.range(FiveCharWords.length);
//   return [
//     SixCharWords[first],
//     FiveCharWords[second],
//     FiveCharWords[third],
//     FiveCharWords[fourth],
//     FiveCharWords[fifth],
//   ];
// }

export function getTodaysLetters(): Letter[] {
  const [words, letters] = getWordsAndLetters();
  console.info(words, letters);
  return shuffle(letters).map((letter) => ({ id: uuidv4(), letter }));
}

function printBoard(board: SolutionBoard, highlights: Position[]) {
  console.info("    0 1 2 3 4 5");
  for (let r = 0; r < LetterBounds; r++) {
    let parts = [];
    for (let c = 0; c < LetterBounds; c++) {
      const highlight = highlights.find((p) => p.row === r && p.col === c);
      const letter = board[r][c]?.toUpperCase() || "-";
      if (highlight && letter) {
        parts.push(`\x1b[31m${letter}`);
      } else {
        parts.push(`\x1b[30m${letter}`);
      }
    }
    parts.push(`\x1b[30m|`);
    console.info(`${r} | ${parts.join(" ")}`);
  }
}
