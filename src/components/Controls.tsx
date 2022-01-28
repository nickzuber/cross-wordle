import { FC, useCallback, useContext } from "react";
import styled from "@emotion/styled";
import { Directions, Letter } from "../utils/game";
import { GameContext } from "../contexts/game";

export const Controls: FC = () => {
  const {
    letters,
    boardLetterIds,
    setLetterOnBoard,
    shiftBoard,
    requestFinish,
    clearBoard,
    backspaceBoard,
    canFinish,
  } = useContext(GameContext);

  const onLetterButtonPress = useCallback(
    (letter: Letter) => {
      setLetterOnBoard(letter);
    },
    [setLetterOnBoard],
  );

  const topLetters = letters.slice(0, 8);
  const middleLetters = letters.slice(8, 15);
  const bottomLetters = letters.slice(15, 19);

  return (
    <Container>
      <ButtonsContainer>
        <button onClick={() => shiftBoard(Directions.Left)}>left</button>
        <button onClick={() => shiftBoard(Directions.Up)}>up</button>
        <button onClick={() => shiftBoard(Directions.Down)}>down</button>
        <button onClick={() => shiftBoard(Directions.Right)}>right</button>
        <button onClick={clearBoard}>Clear board</button>
      </ButtonsContainer>

      <LettersContainer>
        <LettersRow>
          {topLetters.map((letter) =>
            boardLetterIds.has(letter.id) ? (
              <DisabledLetterButton key={letter.id} />
            ) : (
              <LetterButton
                onClick={() => onLetterButtonPress(letter)}
                key={letter.id}
              >
                {letter.letter}
              </LetterButton>
            ),
          )}
        </LettersRow>

        <LettersRow>
          {middleLetters.map((letter) =>
            boardLetterIds.has(letter.id) ? (
              <DisabledLetterButton key={letter.id} />
            ) : (
              <LetterButton
                onClick={() => onLetterButtonPress(letter)}
                key={letter.id}
              >
                {letter.letter}
              </LetterButton>
            ),
          )}
        </LettersRow>

        <LettersRow>
          <ActionButton disabled={!canFinish} onClick={requestFinish}>
            {"Enter"}
          </ActionButton>
          {bottomLetters.map((letter) =>
            boardLetterIds.has(letter.id) ? (
              <DisabledLetterButton key={letter.id} />
            ) : (
              <LetterButton
                onClick={() => onLetterButtonPress(letter)}
                key={letter.id}
              >
                {letter.letter}
              </LetterButton>
            ),
          )}
          <ActionButton onClick={backspaceBoard}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <path
                fill="var(--color-tone-1)"
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
`;

const ButtonsContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: #fff;
  width: 360px; // 6 tiles * tile size
  min-height: 50px;
`;

const LettersContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background: #fff;
  width: 360px; // 6 tiles * tile size
  min-height: 50px;
`;

const LettersRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LetterButton = styled.button`
  height: 56px;
  width: 38px;
  font-weight: 700;
  font-size: 14px;
  border: 0;
  padding: 0;
  margin: 0 6px 6px 0;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #d3d6da;
  user-select: none;
`;

const DisabledLetterButton = styled(LetterButton)`
  opacity: 0.5;
`;

const ActionButton = styled(LetterButton)`
  width: 72px;
`;
