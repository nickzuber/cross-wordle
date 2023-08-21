import { toBlob } from "html-to-image";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import createPersistedState from "use-persisted-state";
import { PersistedStates } from "../constants/state";
import { ModalsContext } from "../contexts/modals";
import { ToastContext } from "../contexts/toast";
import {
  countSolutionBoardScore,
  createScoredBoard,
  createUnscoredBoard,
  getInvalidWords,
  validateBoard,
  validateWordIsland,
} from "../utils/board-validator";
import {
  Board,
  Config,
  Directions,
  Letter,
  getPuzzleNumber,
  isBoardScored,
} from "../utils/game";
import { ScoredSolutionBoard, SolutionBoard } from "../utils/words-helper";
import { useBoard } from "./useBoard";
import { useLetters } from "./useLetters";

const useIsGameOver = createPersistedState(PersistedStates.GameOver);
const useHardMode = createPersistedState(PersistedStates.HardMode);
const useScoreMode = createPersistedState(PersistedStates.ScoreMode);

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
  const [scoreMode] = useScoreMode(false);
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

  // If the board is in score mode and the board isn't already scored
  // (on fresh page load), we should score it.
  useEffect(() => {
    if (!isGameOver) return;

    if (!scoreMode && isBoardScored(board)) {
      console.info("UN-SCORING");
      const unscoredBoard = createUnscoredBoard(board);
      setBoard(unscoredBoard);
      return;
    }

    if (scoreMode && !isBoardScored(board)) {
      console.info("SCORING");
      const scoredBoard = createScoredBoard(board);
      setBoard(scoredBoard);
      return;
    }
  }, [scoreMode, isGameOver, board]);

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

    // Score the board.
    const finalBoard = scoreMode ? createScoredBoard(newBoard) : newBoard;

    // Animate the tiles.
    setBoard(finalBoard);

    // End the game.
    setIsGameOver(true);

    // Show the stats modal.
    setTimeout(openStats, 2000);
  }, [board, canFinish, clearToast, scoreMode]); // eslint-disable-line react-hooks/exhaustive-deps

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
  a: "𝙰",
  b: "𝙱",
  c: "𝙲",
  d: "𝙳",
  e: "𝙴",
  f: "𝙵",
  g: "𝙶",
  h: "𝙷",
  i: "𝙸",
  j: "𝙹",
  k: "𝙺",
  l: "𝙻",
  m: "𝙼",
  n: "𝙽",
  o: "𝙾",
  p: "𝙿",
  q: "𝚀",
  r: "𝚁",
  s: "𝚂",
  t: "𝚃",
  u: "𝚄",
  v: "𝚅",
  w: "𝚆",
  x: "𝚇",
  y: "𝚈",
  z: "𝚉",
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

function getEmojiSolutionBoard(board: SolutionBoard) {
  const boardString = board
    .map((row) => {
      return row
        .map((tile) => {
          const letter = tile?.toLocaleLowerCase();
          return letter ?? " ";
        })
        .join(CharacterSpacing);
    })
    .join("\n");

  return boardString;
}

function printEmojiScoredSolutionBoard(board: ScoredSolutionBoard) {
  const parts = [""];
  const styles = [];
  for (let c = 0; c < 6; c++) {
    for (let r = 0; r < 6; r++) {
      const tile = board[c][r];
      const letter = tile.letter?.toLocaleLowerCase();
      switch (tile.score) {
        case 1:
          parts.push(`%c${letter}`);
          styles.push("color: #da77f2");
          break;
        case 2:
          parts.push(`%c${letter}`);
          styles.push("color: #ffd43b");
          break;
        case 3:
          parts.push(`%c${letter}`);
          styles.push("color: #40c057");
          break;
        case 4:
          parts.push(`%c${letter}`);
          styles.push("color: #fa5252");
          break;
        default:
          parts.push("%c" + (letter ?? " "));
          styles.push("color: #495057");
      }
      parts.push(" ");
    }
    parts.push("\n");
  }

  console.info(parts.join(""), ...styles);

  const score = countSolutionBoardScore(board);
  console.info(
    `Score: %c${score}`,
    `color: ${score > 30 ? "green" : score > 24 ? "blue" : "#aaa"}`,
  );
  console.info(
    `%c1, %c2, %c3, %c4`,
    "color: #da77f2",
    "color: #ffd43b",
    "color: #40c057",
    "color: #fa5252",
  );
}
