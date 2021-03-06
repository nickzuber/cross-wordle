import React, { useCallback, useContext, useMemo } from "react";
import { Board, Config, Directions, getPuzzleNumber, Letter } from "../utils/game";
import {
  countValidLettersOnBoard,
  getInvalidWords,
  validateBoard,
  validateWordIsland,
} from "../utils/board-validator";
import { useBoard } from "./useBoard";
import { useLetters } from "./useLetters";
import { SolutionBoard } from "../utils/words-helper";
import createPersistedState from "use-persisted-state";
import { PersistedStates } from "../constants/state";
import { ModalsContext } from "../contexts/modals";
import { ToastContext } from "../contexts/toast";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";

const useIsGameOver = createPersistedState(PersistedStates.GameOver);
const useHardMode = createPersistedState(PersistedStates.HardMode);

export type GameOptions = {
  solutionBoard: SolutionBoard;
  isGameOver: boolean;
  board: Board;
  letters: Letter[];
  unusedLetters: Letter[];
  boardLetterIds: Set<string>;
  setLetterOnBoard: (letter: Letter) => void;
  shuffleLetters: () => void;
  requestFinish: () => void;
  clearBoard: () => void;
  flipCursorDirection: () => void;
  canFinish: boolean;
  updateCursor: (row: number, col: number) => void;
  backspaceBoard: () => void;
  getShareClipboardItem: () => Promise<[ClipboardItem, File] | null>;
  shiftBoard: (direction: Directions) => void;
  moveCursorInDirection: (direction: Directions) => void;
};

export const useGame = (): GameOptions => {
  const { openStats } = useContext(ModalsContext);
  const { clearToast } = useContext(ToastContext);
  const [isGameOver, setIsGameOver] = useIsGameOver(false);
  const [hardMode] = useHardMode(false);
  const { letters, solutionBoard, shuffleLetters } = useLetters();
  const {
    board,
    setLetterOnBoard,
    resetBoard,
    setBoard,
    updateCursor,
    backspaceBoard,
    flipCursorDirection,
    shiftBoard,
    moveCursorInDirection,
  } = useBoard();

  const tilesAreConnected = React.useMemo(() => validateWordIsland(board), [board]);

  const boardLetterIds = React.useMemo(
    () =>
      new Set(
        board.tiles
          .map((row) => row.map((tile) => tile.letter))
          .flat()
          .filter((letter) => letter !== null)
          .map((letter) => (letter as Letter).id),
      ),
    [board],
  );

  const canFinish = useMemo(() => {
    if (hardMode) {
      return tilesAreConnected && boardLetterIds.size === Config.MaxLetters;
    } else {
      return tilesAreConnected && boardLetterIds.size > 5;
    }
  }, [hardMode, tilesAreConnected, boardLetterIds]);

  const requestFinish = useCallback(() => {
    if (!canFinish) return;
    clearToast();

    // Validate the board.
    const [newBoard] = validateBoard(board);

    // Animate the tiles.
    setBoard(newBoard);

    // End the game.
    setIsGameOver(true);

    // Show the stats modal.
    setTimeout(openStats, 2000);
  }, [board, canFinish, clearToast]); // eslint-disable-line react-hooks/exhaustive-deps

  const unusedLetters = letters.filter((letter) => !boardLetterIds.has(letter.id));

  const getShareClipboardItem = useCallback(async () => {
    const node = document.getElementById("canvas");

    if (node) {
      const imgBlob = await toBlob(node);

      if (!imgBlob) {
        return null;
      }

      try {
        const clipboardItem = new ClipboardItem({
          "image/png": imgBlob as Blob,
        });
        const blobFile = new File([imgBlob], `Crosswordle-${getPuzzleNumber()}.png`, {
          type: "image/png",
        });
        return [clipboardItem, blobFile] as [ClipboardItem, File];
      } catch (error) {
        return null;
      }
    }

    return null;
  }, [board, hardMode]);

  return {
    solutionBoard,
    board,
    letters,
    unusedLetters,
    boardLetterIds,
    setLetterOnBoard,
    shuffleLetters,
    requestFinish,
    clearBoard: resetBoard,
    canFinish,
    updateCursor,
    flipCursorDirection,
    backspaceBoard,
    shiftBoard,
    moveCursorInDirection,
    isGameOver: isGameOver as boolean,
    getShareClipboardItem,
  };
};

const tileLetterToAscii: Record<string, string> = {
  a: "????",
  b: "????",
  c: "????",
  d: "????",
  e: "????",
  f: "????",
  g: "????",
  h: "????",
  i: "????",
  j: "????",
  k: "????",
  l: "????",
  m: "????",
  n: "????",
  o: "????",
  p: "????",
  q: "????",
  r: "????",
  s: "????",
  t: "????",
  u: "????",
  v: "????",
  w: "????",
  x: "????",
  y: "????",
  z: "????",
};

const EmptyCharacter = "  ";
const CharacterSpacing = "  ";

function getEmojiBoard(board: Board) {
  const boardString = board.tiles
    .map((row) => {
      return row
        .map((tile) => {
          const key = tile.letter?.letter.toLocaleLowerCase();
          return key ? tileLetterToAscii[key] : EmptyCharacter || EmptyCharacter;
        })
        .join(CharacterSpacing);
    })
    .join("\n");

  const invalidWords = getInvalidWords(board);
  if (invalidWords.length > 0) {
    return `${boardString}\n\nInvalid words: ${invalidWords.join(", ")}`;
  }

  return boardString;
}
