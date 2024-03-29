import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { FC, useCallback, useContext, useEffect } from "react";
import createPersistedState from "use-persisted-state";
import { PopIn } from "../constants/animations";
import { PersistedStates } from "../constants/state";
import { AppTheme } from "../constants/themes";
import { GameContext } from "../contexts/game";
import { ToastContext } from "../contexts/toast";
import { Directions, Letter } from "../utils/game";

const useHardMode = createPersistedState(PersistedStates.HardMode);

export const Controls: FC = () => {
  const theme = useTheme() as AppTheme;
  const {
    letters,
    boardLetterIds,
    setLetterOnBoard,
    shiftBoard,
    moveCursorInDirection,
    requestFinish,
    backspaceBoard,
    canFinish,
    isGameOver,
    flipCursorDirection,
    unusedLetters,
  } = useContext(GameContext);
  const { sendToast } = useContext(ToastContext);
  const [hardMode] = useHardMode(false);

  const disableEnterButton = !canFinish || isGameOver;

  const onEnterPress = useCallback(() => {
    if (disableEnterButton) {
      if (hardMode) {
        const message =
          unusedLetters.length > 0
            ? `You still have to place ${unusedLetters.length} letter${
                unusedLetters.length !== 1 ? "s" : ""
              } on the board.`
            : "All words must be connected like a crossword.";
        sendToast(message);
      } else {
        const message =
          unusedLetters.length > 15
            ? "Try using some more letters to make as many words as you can - you got this!"
            : "All words must be connected like a crossword.";
        sendToast(message);
      }
    } else {
      requestFinish();
    }
  }, [hardMode, sendToast, disableEnterButton, unusedLetters, requestFinish]);

  const onLetterButtonPress = useCallback(
    (letter: Letter) => {
      setLetterOnBoard(letter);
    },
    [setLetterOnBoard],
  );

  useEffect(() => {
    if (isGameOver) return;

    function listenForKeyboard(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      switch (key) {
        case "enter":
          requestFinish();
          break;
        case "backspace":
          backspaceBoard();
          break;
        case " ":
          flipCursorDirection();
          break;
        case "arrowdown":
          moveCursorInDirection(Directions.Down);
          break;
        case "arrowup":
          moveCursorInDirection(Directions.Up);
          break;
        case "arrowleft":
          moveCursorInDirection(Directions.Left);
          break;
        case "arrowright":
          moveCursorInDirection(Directions.Right);
          break;
        default:
          const letterForKeypress = letters.find(
            (letter) => letter.letter.toLowerCase() === key && !boardLetterIds.has(letter.id),
          );
          if (letterForKeypress) {
            setLetterOnBoard(letterForKeypress);
          }
          break;
      }
    }

    document.addEventListener("keydown", listenForKeyboard);
    return () => document.removeEventListener("keydown", listenForKeyboard);
  }, [
    letters,
    boardLetterIds,
    backspaceBoard,
    setLetterOnBoard,
    flipCursorDirection,
    moveCursorInDirection,
    requestFinish,
    isGameOver,
  ]);

  const topLetters = letters.slice(0, 8);
  const middleLetters = letters.slice(8, 15);
  const bottomLetters = letters.slice(15, 20);

  return (
    <Container id="keyboard">
      <ButtonsContainer theme={theme}>
        <BoardButton
          theme={theme}
          disabled={isGameOver}
          onClick={() => shiftBoard(Directions.Left)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.25 4.75V19.25"
              stroke={theme.colors.text}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M4.75 12H15.25"
              stroke={theme.colors.text}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M8.25 8.75L4.75 12L8.25 15.25"
              stroke={theme.colors.text}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </BoardButton>
        <BoardButton
          theme={theme}
          disabled={isGameOver}
          onClick={() => shiftBoard(Directions.Up)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.75 19.25H19.25"
              stroke={theme.colors.text}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M12 15.25V4.75"
              stroke={theme.colors.text}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M15.25 8.25L12 4.75L8.75 8.25"
              stroke={theme.colors.text}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </BoardButton>
        <BoardButton
          theme={theme}
          disabled={isGameOver}
          onClick={flipCursorDirection}
          style={{ width: 142 }}
        >
          Change direction
        </BoardButton>
        <BoardButton
          theme={theme}
          disabled={isGameOver}
          onClick={() => shiftBoard(Directions.Down)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.75 4.75H19.25"
              stroke={theme.colors.text}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M12 19.25V8.75"
              stroke={theme.colors.text}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M15.25 15.75L12 19.25L8.75 15.75"
              stroke={theme.colors.text}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </BoardButton>
        <BoardButton
          theme={theme}
          disabled={isGameOver}
          onClick={() => shiftBoard(Directions.Right)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.75 4.75V19.25"
              stroke={theme.colors.text}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M8.75 12H19.25"
              stroke={theme.colors.text}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M15.75 8.75L19.25 12L15.75 15.25"
              stroke={theme.colors.text}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </BoardButton>
      </ButtonsContainer>

      <LettersContainer theme={theme}>
        <LettersRow>
          {topLetters.map((letter) =>
            boardLetterIds.has(letter.id) ? (
              <DisabledLetterButton key={letter.id} disabled={true} theme={theme} />
            ) : (
              <LetterButton
                disabled={isGameOver}
                onClick={() => onLetterButtonPress(letter)}
                key={letter.id}
                theme={theme}
              >
                {letter.letter}
              </LetterButton>
            ),
          )}
        </LettersRow>

        <LettersRow>
          {middleLetters.map((letter) =>
            boardLetterIds.has(letter.id) ? (
              <DisabledLetterButton key={letter.id} disabled={true} theme={theme} />
            ) : (
              <LetterButton
                disabled={isGameOver}
                onClick={() => onLetterButtonPress(letter)}
                key={letter.id}
                theme={theme}
              >
                {letter.letter}
              </LetterButton>
            ),
          )}
        </LettersRow>

        <LettersRow>
          <ActionButton disabled={isGameOver} onClick={() => onEnterPress()} theme={theme}>
            {"Enter"}
          </ActionButton>
          {bottomLetters.map((letter) =>
            boardLetterIds.has(letter.id) ? (
              <DisabledLetterButton key={letter.id} disabled={true} theme={theme} />
            ) : (
              <LetterButton
                disabled={isGameOver}
                onClick={() => onLetterButtonPress(letter)}
                key={letter.id}
                theme={theme}
              >
                {letter.letter}
              </LetterButton>
            ),
          )}
          <ActionButton disabled={isGameOver} onClick={backspaceBoard} theme={theme}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path
                fill={theme.colors.text}
                d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
              ></path>
            </svg>
          </ActionButton>
        </LettersRow>
      </LettersContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex: 0 0 200px;
  margin: 0;

  @media (max-height: 670px) {
    flex: 0 0 140px;
  }
`;

const ButtonsContainer = styled.div<{ theme: AppTheme }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: ${(p) => p.theme.colors.primary};
  width: 100%;
  min-height: 50px;
  max-width: 360px;
  padding: 0;
  margin-bottom: 6px;

  @media (max-height: 670px) {
    min-height: 40px;
  }
`;

const LettersContainer = styled.div<{ theme: AppTheme }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background: ${(p) => p.theme.colors.primary};
  width: 360px; // 6 tiles * tile size
  min-height: 50px;
`;

const LettersRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LetterButton = styled.button<{ theme: AppTheme }>`
  height: 56px;
  width: 38px;
  color: ${(p) => p.theme.colors.text};
  font-weight: 700;
  font-size: 14px;
  border: 0;
  padding: 0;
  margin: 3px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.tileSecondary};
  user-select: none;
  text-transform: uppercase;
  transition: all 50ms ease-in, height: 200ms ease-in;
  animation: ${PopIn} 150ms;

  &:active:not([disabled]) {
    background: ${(p) => p.theme.colors.buttonActive};
    transform: translateY(2px);
  }

  @media (max-height: 670px) {
    height: 52px;
  }

  @media (max-height: 646px) {
    height: 48px;
  }

  @media (max-height: 630px) {
    height: 44px;
  }

  @media (max-width: 370px) {
    width: 34px;
  }
`;

const DisabledLetterButton = styled(LetterButton)`
  opacity: 0.5;
`;

const ActionButton = styled(LetterButton)`
  width: 64px;
  text-transform: none;
  transition: opacity 100ms ease-in;

  &:disabled {
    opacity: 0.5;
  }

  @media (max-width: 370px) {
    width: 60px;
  }
`;

const BoardButton = styled(LetterButton)`
  margin: 0;
  width: 48px;
  height: 48px;
  padding: 8px 12px;
  text-transform: none;

  @media (max-height: 670px) {
    height: 44px;
  }

  @media (max-height: 646px) {
    height: 40px;
  }

  @media (max-height: 630px) {
    height: 36px;
  }

  @media (max-width: 370px) {
    width: 44px;
  }
`;
