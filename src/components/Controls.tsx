import { FC, useContext } from "react";
import styled from "@emotion/styled";
import { useDrag, useDrop } from "react-dnd";
import { DragBoardTileItem, DragTypes } from "../constants/game";
import { Letter } from "../utils/game";
import { GameContext } from "../contexts/game";

type DraggableTileProps = {
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
  } = useContext(GameContext);

  const [{ isOver, item, isDraggingBoardTile }, drop] = useDrop(() => ({
    accept: [DragTypes.BoardTile],
    drop(item: DragBoardTileItem, monitor) {
      console.info(item, monitor.getItemType());
      const [prevRow, prevCol] = (item as DragBoardTileItem).position;
      setLetterOnBoard([prevRow, prevCol], null);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      item: monitor.getItem(),
      isDraggingBoardTile: monitor.getItemType() === DragTypes.BoardTile,
    }),
  }));

  return (
    <Container ref={drop}>
      <ButtonsContainer>
        <button onClick={shuffleLetters}>Shuffle</button>
        <button onClick={clearBoard}>Clear board</button>
        <button onClick={requestFinish}>Finish</button>
      </ButtonsContainer>

      {isDraggingBoardTile ? (
        <DropZone hovered={isOver}>
          <span>{"Put letter back"}</span>
        </DropZone>
      ) : null}
      <LettersContainer>
        {letters.map((letter) =>
          boardLetterIds.has(letter.id) ? (
            <DisabledLetterButton key={letter.id} />
          ) : (
            <DraggableLetterButton
              key={letter.id}
              letter={letter}
              dragging={letter.id === item?.letter.id}
            />
          ),
        )}
      </LettersContainer>
    </Container>
  );
};

const DraggableLetterButton: FC<DraggableTileProps> = ({
  letter,
  dragging,
}) => {
  const [collected, drag] = useDrag(() => ({
    type: DragTypes.Tile,
    item: { letter },
  }));

  return (
    <LetterButton ref={drag} {...collected} dragging={dragging}>
      {letter.letter}
    </LetterButton>
  );
};

type Hoverable = {
  hovered?: boolean;
};

type Draggable = {
  dragging?: boolean;
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

const DropZone = styled.div<Hoverable>`
  position: absolute;
  z-index: 9999;
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${(p) => (p.hovered ? "#eeeeeeaa" : "#ffffffaa")};

  span {
    background: #ffffff;
    padding: 4px 8px;
  }
`;

const LetterButton = styled.div<Draggable>`
  height: 58px;
  width: 38px;
  font-weight: 700;
  font-size: 20px;
  border: 0;
  padding: 0;
  margin: 0 10px 10px 0;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d3d6da;
  user-select: none;
  opacity: ${(p) => (p.dragging ? 0.5 : 1)};
`;

const DisabledLetterButton = styled(LetterButton)`
  opacity: 0.5;
`;
