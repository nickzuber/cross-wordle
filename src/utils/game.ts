export const Config = {
  MaxLetters: 15,
  TileCount: 12,
  TileSize: 60,
  TileSpacing: 10,
};

export type Letter = {
  id: string;
  letter: string;
};

export type Tile = {
  id: string;
  row: number;
  col: number;
  letter: Letter | null;
};

export type Board = {
  tiles: Tile[][];
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
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export function getRandomLetters(n: number) {
  return getRandom(Letters, n);
}
