export const Config = {
  MaxLetters: 20,
  TileCount: 6,
  TileSize: 60,
  TileSpacing: 10,
};

export enum GameState {
  Playing,
  Ended,
}

export enum Directions {
  Up,
  Left,
  Down,
  Right,
}

export enum CursorDirections {
  LeftToRight = "left-to-right",
  TopToBottom = "top-to-bottom",
}

type Cursor = {
  row: number;
  col: number;
  direction: CursorDirections;
};

export type Letter = {
  id: string;
  letter: string; // TODO: refactor to `char`
};

export enum TileState {
  IDLE = "idle",
  VALID = "valid",
  INVALID = "invalid",
  MIXED = "mixed",
}

export enum TileChangeReason {
  MOVED = "moved",
  LETTER = "letter",
}

export type Tile = {
  id: string;
  row: number;
  col: number;
  letter: Letter | null;
  state: TileState;
  changeReason: TileChangeReason | undefined;
};

export type Board = {
  tiles: Tile[][];
  cursor: Cursor;
};

// https://en.wikipedia.org/wiki/Bananagrams#cite_note-7
const Letters = [
  "J",
  "K",
  "Q",
  "X",
  "Z",
  "J",
  "K",
  "Q",
  "X",
  "Z",
  "B",
  "C",
  "F",
  "H",
  "M",
  "P",
  "V",
  "W",
  "Y",
  "B",
  "C",
  "F",
  "H",
  "M",
  "P",
  "V",
  "W",
  "Y",
  "B",
  "C",
  "F",
  "H",
  "M",
  "P",
  "V",
  "W",
  "Y",
  "G",
  "G",
  "G",
  "G",
  "L",
  "L",
  "L",
  "L",
  "L",
  "D",
  "S",
  "U",
  "D",
  "S",
  "U",
  "D",
  "S",
  "U",
  "D",
  "S",
  "U",
  "D",
  "S",
  "U",
  "D",
  "S",
  "U",
  "N",
  "N",
  "N",
  "N",
  "N",
  "N",
  "N",
  "N",
  "T",
  "R",
  "T",
  "R",
  "T",
  "R",
  "T",
  "R",
  "T",
  "R",
  "T",
  "R",
  "T",
  "R",
  "T",
  "R",
  "T",
  "R",
  "O",
  "O",
  "O",
  "O",
  "O",
  "O",
  "O",
  "O",
  "O",
  "O",
  "O",
  "I",
  "I",
  "I",
  "I",
  "I",
  "I",
  "I",
  "I",
  "I",
  "I",
  "I",
  "I",
  "A",
  "A",
  "A",
  "A",
  "A",
  "A",
  "A",
  "A",
  "A",
  "A",
  "A",
  "A",
  "E",
  "E",
  "E",
  "E",
  "E",
  "E",
  "E",
  "E",
  "E",
  "E",
  "E",
  "E",
  "E",
  "E",
  "E",
  "E",
  "E",
  "E",
];

// @TODO use a seeded randomizer so we can get one combo per day.
function getRandom<T>(arr: T[], n: number) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len) throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export function shuffle<T>(arr: T[]): T[] {
  return getRandom(arr, arr.length);
}

export function getRandomLetters(n: number) {
  return getRandom(Letters, n);
}

export function wrapCursor(board: Board, cursor: Cursor): Cursor {
  const maxRow = board.tiles.length;
  const maxCol = board.tiles[0].length;

  const rowOverflow = Math.floor(cursor.row / maxRow);
  const colOverflow = Math.floor(cursor.col / maxCol);

  // Simple case, just bring back to reality.
  if (rowOverflow && colOverflow) {
    return {
      row: cursor.row % maxRow,
      col: cursor.col % maxCol,
      direction: cursor.direction,
    };
  }

  // If only the row is overflowing, increment as needed.
  if (rowOverflow > 0) {
    return {
      row: cursor.row % maxRow,
      col: (cursor.col + rowOverflow) % maxCol,
      direction: cursor.direction,
    };
  }

  // If only the col is overflowing, increment as needed.
  if (colOverflow > 0) {
    return {
      row: (cursor.row + colOverflow) % maxRow,
      col: (maxCol + cursor.col) % maxCol,
      direction: cursor.direction,
    };
  }

  // If only the row is underflowing, increment as needed.
  if (rowOverflow < 0) {
    return {
      row: (maxRow + cursor.row) % maxRow,
      col: (maxCol + cursor.col + rowOverflow) % maxCol,
      direction: cursor.direction,
    };
  }
  // If only the col is underflowing, increment as needed.
  if (colOverflow < 0) {
    return {
      row: (maxRow + cursor.row + colOverflow) % maxRow,
      col: (maxCol + cursor.col) % maxCol,
      direction: cursor.direction,
    };
  }

  return cursor;
}

export function incrementCursor(board: Board): Cursor {
  return moveBoardCursorToNextEmptyTile(board) || board.cursor;
}

function moveBoardCursorToNextEmptyTile(board: Board) {
  const { row, col, direction } = board.cursor;

  switch (direction) {
    case CursorDirections.LeftToRight: {
      // If we're on a letter, always just move forward 1.
      if (getTileAtCursor(board).letter) {
        return wrapCursor(board, {
          row,
          col: col + 1,
          direction,
        });
      }

      // Otherwise, move to next empty square.
      let nextCursor;

      // Max 36 attempts. Kinda jank but guarentees no infinte loop.
      for (let i = 1; i < 36; i++) {
        nextCursor = wrapCursor(board, {
          row,
          col: col + i,
          direction,
        });

        if (!getTileAtCursor(board, nextCursor).letter) {
          return nextCursor;
        }
      }

      return nextCursor;
    }
    case CursorDirections.TopToBottom: {
      // If we're on a letter, always just move forward 1.
      if (getTileAtCursor(board).letter) {
        return wrapCursor(board, {
          row: row + 1,
          col,
          direction,
        });
      }

      // Otherwise, move to next empty square.
      let nextCursor;

      // Max 36 attempts. Kinda jank but guarentees no infinte loop.
      for (let i = 1; i < 36; i++) {
        nextCursor = wrapCursor(board, {
          row: row + i,
          col,
          direction,
        });

        if (!getTileAtCursor(board, nextCursor).letter) {
          return nextCursor;
        }
      }

      return nextCursor;
    }
  }
}

export function getTileAtCursor(board: Board, cursor?: Cursor): Tile {
  const c = cursor || board.cursor;
  return board.tiles[c.row][c.col];
}

export function decrementCursor(board: Board): Cursor {
  const cursor = board.cursor;

  switch (cursor.direction) {
    case CursorDirections.LeftToRight:
      return wrapCursor(board, {
        row: cursor.row,
        col: cursor.col - 1,
        direction: cursor.direction,
      });
    case CursorDirections.TopToBottom:
      return wrapCursor(board, {
        row: cursor.row - 1,
        col: cursor.col,
        direction: cursor.direction,
      });
  }
}

function shiftBoardUp(board: Board): Board {
  const row = board.tiles[0];
  const newLetterPositions = [...board.tiles.slice(1), row].map((row) =>
    row.map((tile) => tile.letter),
  );

  const newTiles = board.tiles.slice();
  for (let r = 0; r < board.tiles.length; r++) {
    for (let c = 0; c < board.tiles[0].length; c++) {
      newTiles[r][c] = {
        ...newTiles[r][c],
        letter: newLetterPositions[r][c],
        changeReason: TileChangeReason.MOVED,
      };
    }
  }

  return {
    cursor: {
      ...board.cursor,
      row: (board.tiles.length + board.cursor.row - 1) % board.tiles.length,
    },
    tiles: newTiles,
  };
}

function shiftBoardDown(board: Board): Board {
  const row = board.tiles[board.tiles.length - 1];
  const newLetterPositions = [row, ...board.tiles.slice(0, board.tiles.length - 1)].map((row) =>
    row.map((tile) => tile.letter),
  );

  const newTiles = board.tiles.slice();
  for (let r = 0; r < board.tiles.length; r++) {
    for (let c = 0; c < board.tiles[0].length; c++) {
      newTiles[r][c] = {
        ...newTiles[r][c],
        letter: newLetterPositions[r][c],
        changeReason: TileChangeReason.MOVED,
      };
    }
  }

  return {
    cursor: {
      ...board.cursor,
      row: (board.tiles.length + board.cursor.row + 1) % board.tiles.length,
    },
    tiles: newTiles,
  };
}

function shiftBoardLeft(board: Board): Board {
  const maxC = board.tiles[0].length;
  const prevLetterPositions = board.tiles.map((row) => row.map((tile) => tile.letter));

  const newLetterPositions = prevLetterPositions.map((_) => []) as (Letter | null)[][];

  for (let r = 0; r < board.tiles.length; r++) {
    for (let c = 0; c < board.tiles[0].length; c++) {
      newLetterPositions[r][c] = prevLetterPositions[r][(maxC + c + 1) % maxC];
    }
  }

  const newTiles = board.tiles.slice();
  for (let r = 0; r < board.tiles.length; r++) {
    for (let c = 0; c < board.tiles[0].length; c++) {
      newTiles[r][c] = {
        ...newTiles[r][c],
        letter: newLetterPositions[r][c],
        changeReason: TileChangeReason.MOVED,
      };
    }
  }

  return {
    cursor: {
      ...board.cursor,
      col: (maxC + board.cursor.col - 1) % maxC,
    },
    tiles: newTiles,
  };
}

function shiftBoardRight(board: Board): Board {
  const maxC = board.tiles[0].length;
  const prevLetterPositions = board.tiles.map((row) => row.map((tile) => tile.letter));

  const newLetterPositions = prevLetterPositions.map((_) => []) as (Letter | null)[][];

  for (let r = 0; r < board.tiles.length; r++) {
    for (let c = 0; c < board.tiles[0].length; c++) {
      newLetterPositions[r][c] = prevLetterPositions[r][(maxC + c - 1) % maxC];
    }
  }

  const newTiles = board.tiles.slice();
  for (let r = 0; r < board.tiles.length; r++) {
    for (let c = 0; c < board.tiles[0].length; c++) {
      newTiles[r][c] = {
        ...newTiles[r][c],
        letter: newLetterPositions[r][c],
        changeReason: TileChangeReason.MOVED,
      };
    }
  }

  return {
    cursor: {
      ...board.cursor,
      col: (maxC + board.cursor.col + 1) % maxC,
    },
    tiles: newTiles,
  };
}

export function moveBoard(board: Board, direction: Directions): Board {
  switch (direction) {
    case Directions.Up:
      return shiftBoardUp(board);
    case Directions.Down:
      return shiftBoardDown(board);
    case Directions.Left:
      return shiftBoardLeft(board);
    case Directions.Right:
      return shiftBoardRight(board);
  }
}
