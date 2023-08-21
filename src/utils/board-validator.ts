import { words as dictionary } from "../constants/words";
import { Board, ScoredBoard, ScoredTile, Tile, TileState } from "./game";
import { ScoredSolutionBoard, ScoredSolutionLetter, SolutionBoard } from "./words-helper";

enum WordDirection {
  LeftToRight,
  TopToBottom,
}

type WordFromTile = {
  word: string;
  row: number;
  col: number;
  direction: WordDirection;
};

// Check if all words on the board are connected like a crossword.
// Algorithm is roughly:
//  - treat tiles as 2D array
//  - count all letters used <- total
//  - scan until we find a single tile
//  - recursively DFS tile with its neighbors
//  - keep track of all nodes we've seen via WeakMap
//  - when DFS completes, compare total with WeakMap.size()
//  - equal means valid, otherwise invalid
export function validateWordIsland(board: Board) {
  const tiles = board.tiles;
  const maxRow = tiles.length;
  const maxCol = tiles[0].length;
  const total = countFilledTiles(tiles);

  // Track all visited tiles to avoid infinite loops.
  const visitedTiles = new Set<Tile>();

  // Find any tile to start.
  const startingTile = findAnyTile(tiles);

  // If there were no tiles to be found, we can just exit.
  if (!startingTile) {
    return false;
  }

  function markTilesDFS(tile: Tile | null): void {
    // Ignore tiles that do not exist.
    if (!tile) return;

    // Ignore visited tiles.
    if (visitedTiles.has(tile)) return;

    visitedTiles.add(tile);
    const { row, col } = tile;

    if (row > 0) {
      const tile = tiles[row - 1][col];
      if (tile.letter !== null && !visitedTiles.has(tile)) {
        markTilesDFS(tile);
      }
    }

    if (col > 0) {
      const tile = tiles[row][col - 1];
      if (tile.letter !== null && !visitedTiles.has(tile)) {
        markTilesDFS(tile);
      }
    }

    if (row < maxRow - 1) {
      const tile = tiles[row + 1][col];
      if (tile.letter !== null && !visitedTiles.has(tile)) {
        markTilesDFS(tile);
      }
    }

    if (col < maxCol - 1) {
      const tile = tiles[row][col + 1];
      if (tile.letter !== null && !visitedTiles.has(tile)) {
        markTilesDFS(tile);
      }
    }
  }

  markTilesDFS(startingTile);

  return visitedTiles.size === total;
}

function findAnyTile(tiles: Tile[][]) {
  for (const row of tiles) {
    for (const tile of row) {
      if (tile.letter !== null) {
        return tile;
      }
    }
  }

  return null;
}

export function getInvalidWords(board: Board): Array<string> {
  const tiles = board.tiles;
  const leftToRight = getWordsFromTilesLTR(tiles);
  const topToBottom = getWordsFromTilesTTB(tiles);
  const foundWords = leftToRight.concat(topToBottom);
  const invalidFoundWords = foundWords
    .filter(({ word }) => !dictionary.has(word))
    .map(({ word }) => word);

  return invalidFoundWords;
}

export function validateBoard(board: Board): [Board, boolean] {
  const tiles = board.tiles;
  const gridBounds = tiles.length;

  // Get all words going left to right.
  const leftToRight = getWordsFromTilesLTR(tiles);

  // Get all words going top to bottom.
  const topToBottom = getWordsFromTilesTTB(tiles);

  // Collect all the words together.
  const foundWords = leftToRight.concat(topToBottom);

  // Validate entire board (easier this way).
  let allWordsAreValid = foundWords.every(({ word }) => dictionary.has(word));

  // Initialize all tiles to be invalid.
  const validatedBoard = {
    cursor: board.cursor,
    tiles: tiles.map((row) =>
      row.map((tile) =>
        tile.letter
          ? { ...tile, state: TileState.INVALID }
          : { ...tile, state: TileState.IDLE },
      ),
    ),
  };

  // Validate the found words tiles.
  const validFoundWords = foundWords.filter(({ word }) => dictionary.has(word));
  for (const word of validFoundWords) {
    const length = word.word.length;
    const direction = word.direction;

    switch (direction) {
      case WordDirection.LeftToRight:
        for (let c = 0; c < length; c++) {
          const tile = validatedBoard.tiles[word.row][word.col + c];
          tile.state = TileState.VALID;
        }
        break;
      case WordDirection.TopToBottom:
        for (let r = 0; r < length; r++) {
          if (word.row + r > gridBounds - 1) continue;
          const tile = validatedBoard.tiles[word.row + r][word.col];
          tile.state = TileState.VALID;
        }
        break;
    }
  }

  // Mark any mixed tiles (partially correct).
  // It's easier to do this after we mark the correct tiles.
  const invalidFoundWords = foundWords.filter(({ word }) => !dictionary.has(word));
  for (const word of invalidFoundWords) {
    const length = word.word.length;
    const direction = word.direction;

    switch (direction) {
      case WordDirection.LeftToRight:
        for (let c = 0; c < length; c++) {
          const tile = validatedBoard.tiles[word.row][word.col + c];
          tile.state = tile.state === TileState.VALID ? TileState.INVALID : tile.state;
        }
        break;
      case WordDirection.TopToBottom:
        for (let r = 0; r < length; r++) {
          if (word.row + r > gridBounds - 1) continue;
          const tile = validatedBoard.tiles[word.row + r][word.col];
          tile.state = tile.state === TileState.VALID ? TileState.INVALID : tile.state;
        }
        break;
    }
  }

  return [validatedBoard, allWordsAreValid];
}

export function countSolutionBoardScore(board: ScoredSolutionBoard): number {
  return board
    .map((row) => row.map((tile) => tile.score ?? 0))
    .flat()
    .reduce((acc, score) => acc + score, 0);
}

export function countBoardScore(board: ScoredBoard): number {
  return board.tiles
    .map((row) => row.map((tile) => tile.score ?? 0))
    .flat()
    .reduce((acc, score) => acc + score, 0);
}

export function createScoredBoard(board: Board): ScoredBoard {
  const scoredBoard: ScoredBoard = {
    cursor: board.cursor,
    tiles: scoreTiles(board.tiles),
  };

  return scoredBoard;
}

export function createUnscoredBoard(board: ScoredBoard | Board): Board {
  const scoredBoard: Board = {
    cursor: board.cursor,
    tiles: removeScoreFromTiles(board.tiles),
  };

  return scoredBoard;
}

function removeScoreFromTiles(tiles: (ScoredTile | Tile)[][]): Tile[][] {
  return tiles.map((row) =>
    row.map((tile) => {
      if ("score" in tile) {
        delete tile.score;
      }
      return tile;
    }),
  );
}

function scoreTiles(tiles: Tile[][]): ScoredTile[][] {
  const scoredTiles: ScoredTile[][] = tiles.map((row) =>
    row.map((tile) => ({ ...tile, score: tile.letter ? 0 : undefined })),
  );

  // Search for clusters of letters up to a 4x4 grid.
  // Since there are only 20 letters, a 4x4 cluster is actually the best you can do,
  // since a 5x5 would require 25+ letters.
  for (let clusterSize = 1; clusterSize <= 4; clusterSize++) {
    for (let c = 0; c <= scoredTiles[0].length - clusterSize; c++) {
      for (let r = 0; r <= scoredTiles.length - clusterSize; r++) {
        const startingCoordinate = [c, r] as [number, number];
        if (
          isClusterFullOfValidLetters({
            tiles: scoredTiles,
            clusterSize,
            startingCoordinate,
          })
        ) {
          scoreClusterOfTiles({
            tiles: scoredTiles,
            clusterSize,
            startingCoordinate,
            newScore: clusterSize,
          });
        }
      }
    }
  }

  return scoredTiles;
}

function isClusterFullOfValidLetters(args: {
  tiles: ScoredTile[][];
  clusterSize: number;
  startingCoordinate: [number, number];
}): boolean {
  const { tiles, clusterSize, startingCoordinate } = args;
  const [startingC, startingR] = startingCoordinate;
  for (let c = startingC; c < startingC + clusterSize; c++) {
    for (let r = startingR; r < startingR + clusterSize; r++) {
      const tile = tiles[r][c];
      if (!tile.letter || tile.state !== TileState.VALID) {
        return false;
      }
    }
  }

  return true;
}

function scoreClusterOfTiles(args: {
  tiles: ScoredTile[][];
  clusterSize: number;
  startingCoordinate: [number, number];
  newScore: number;
}): ScoredTile[][] {
  const { tiles, clusterSize, startingCoordinate, newScore } = args;
  const [startingC, startingR] = startingCoordinate;
  for (let c = startingC; c < startingC + clusterSize; c++) {
    for (let r = startingR; r < startingR + clusterSize; r++) {
      const tile = tiles[r][c];
      if (tile.letter) {
        tile.score = newScore;
      }
    }
  }

  return tiles;
}

export function createScoredSolutionBoard(board: SolutionBoard): ScoredSolutionBoard {
  const scoredLetters: ScoredSolutionLetter[][] = board.map((row) =>
    row.map((letter) => ({ letter, score: 0 })),
  );

  // Search for clusters of letters up to a 4x4 grid.
  // Since there are only 20 letters, a 4x4 cluster is actually the best you can do,
  // since a 5x5 would require 25+ letters.
  for (let clusterSize = 1; clusterSize <= 4; clusterSize++) {
    for (let c = 0; c <= scoredLetters[0].length - clusterSize; c++) {
      for (let r = 0; r <= scoredLetters.length - clusterSize; r++) {
        const startingCoordinate = [c, r] as [number, number];
        if (
          isClusterFullOfValidSolutionLetters({
            scoredLetters,
            clusterSize,
            startingCoordinate,
          })
        ) {
          scoreClusterOfSolutionLetters({
            scoredLetters,
            clusterSize,
            startingCoordinate,
            newScore: clusterSize,
          });
        }
      }
    }
  }

  return scoredLetters;
}

function isClusterFullOfValidSolutionLetters(args: {
  scoredLetters: ScoredSolutionLetter[][];
  clusterSize: number;
  startingCoordinate: [number, number];
}): boolean {
  const { scoredLetters, clusterSize, startingCoordinate } = args;
  const [startingC, startingR] = startingCoordinate;
  for (let c = startingC; c < startingC + clusterSize; c++) {
    for (let r = startingR; r < startingR + clusterSize; r++) {
      const tile = scoredLetters[r][c];
      if (!tile.letter) {
        return false;
      }
    }
  }

  return true;
}

function scoreClusterOfSolutionLetters(args: {
  scoredLetters: ScoredSolutionLetter[][];
  clusterSize: number;
  startingCoordinate: [number, number];
  newScore: number;
}): ScoredSolutionLetter[][] {
  const { scoredLetters, clusterSize, startingCoordinate, newScore } = args;
  const [startingC, startingR] = startingCoordinate;
  for (let c = startingC; c < startingC + clusterSize; c++) {
    for (let r = startingR; r < startingR + clusterSize; r++) {
      const letter = scoredLetters[r][c];
      if (letter.letter) {
        letter.score = newScore;
      }
    }
  }

  return scoredLetters;
}

function getWordsFromTilesLTR(tiles: Tile[][]): WordFromTile[] {
  return tiles
    .map((row): WordFromTile[] => {
      const words: WordFromTile[] = [];
      let current: WordFromTile | null = null;

      for (const tile of row) {
        const char = tile.letter?.letter;

        // Initialize.
        if (!current && char) {
          current = {
            word: char,
            row: tile.row,
            col: tile.col,
            direction: WordDirection.LeftToRight,
          };
          continue;
        }

        // Append the new character.
        if (current && char) {
          current.word += char;
          continue;
        }

        // Complete the word.
        if (current && !char) {
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
    .filter((word) => word.word.length > 1)
    .map((word) => ({
      ...word,
      word: word.word.toLowerCase(),
    }));
}

function getWordsFromTilesTTB(tiles: Tile[][]): WordFromTile[] {
  const words: WordFromTile[] = [];

  for (let c = 0; c < tiles[0].length; c++) {
    let current: WordFromTile | null = null;

    for (let r = 0; r < tiles.length; r++) {
      const tile = tiles[r][c];
      const char = tile.letter?.letter;

      // Initialize.
      if (!current && char) {
        current = {
          word: char,
          row: tile.row,
          col: tile.col,
          direction: WordDirection.TopToBottom,
        };
        continue;
      }

      // Append the new character.
      if (current && char) {
        current.word += char;
        continue;
      }

      // Complete the word.
      if (current && !char) {
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

  return words
    .flat()
    .filter((word) => word.word.length > 1)
    .map((word) => ({
      ...word,
      word: word.word.toLowerCase(),
    }));
}

export function countLettersOnBoard(board: Board): number {
  return countFilledTiles(board.tiles);
}

export function countValidLettersOnBoard(board: Board): number {
  return countValidTiles(board.tiles);
}

function countFilledTiles(tiles: Tile[][]) {
  return new Set(
    tiles
      .map((row) => row.map((tile) => tile.letter))
      .flat()
      .filter((letter) => letter !== null),
  ).size;
}

function countValidTiles(tiles: Tile[][]) {
  return new Set(
    tiles
      .map((row) =>
        row
          .filter((tile) => tile.state === TileState.VALID || tile.state === TileState.MIXED)
          .map((letter) => letter.id),
      )
      .flat(),
  ).size;
}
