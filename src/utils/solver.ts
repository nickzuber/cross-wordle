import { Board, Tile } from "./game";

// treat tiles as 2D array
// count all letters used <- total
// scan until we find a single tile
// recursively DFS tile with its neighbors
// keep track of all nodes we've seen via WeakMap
// when DFS completes, compare total with WeakMap.size()
// equal means valid, otherwise invalid
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

function countFilledTiles(tiles: Tile[][]) {
  return new Set(
    tiles
      .map((row) => row.map((tile) => tile.letter))
      .flat()
      .filter((letter) => letter !== null),
  ).size;
}
