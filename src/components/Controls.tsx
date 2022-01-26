import { FC, useCallback, useContext } from "react";
import styled from "@emotion/styled";
import { DragBoardTileItem, DragTypes } from "../constants/game";
import { Letter } from "../utils/game";
import { GameContext } from "../contexts/game";

type TileProps = {
  letter: Letter;
  dragging?: boolean;
};

export const Controls: FC = () => {
  const {
    letters,
    boardLetterIds,
    setLetterOnBoard,
    shuffleLetters,
    requestFinish,
    clearBoard,
    canFinish,
  } = useContext(GameContext);

  const onLetterButtonPress = useCallback(
    (letter: Letter) => {
      setLetterOnBoard(letter);
    },
    [setLetterOnBoard],
  );

  return (
    <Container>
      <ButtonsContainer>
        <button onClick={shuffleLetters}>Shuffle</button>
        <button onClick={clearBoard}>Clear board</button>
        <button disabled={!canFinish} onClick={requestFinish}>
          Finish
        </button>
      </ButtonsContainer>

      <LettersContainer>
        {letters.map((letter) =>
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
  width: 100%;
  min-height: 50px;
`;

const LettersContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background: #fff;
  width: 100%;
  min-height: 50px;
`;

const LetterButton = styled.div`
  height: 56px;
  width: 38px;
  font-weight: 600;
  font-size: 16px;
  border: 0;
  padding: 0;
  margin: 0 6px 6px 0;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d3d6da;
  user-select: none;
`;

const DisabledLetterButton = styled(LetterButton)`
  opacity: 0.5;
`;
