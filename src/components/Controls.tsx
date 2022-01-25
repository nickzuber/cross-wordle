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
      {letters.map((letter) =>
        boardLetterIds.has(letter.id) ? (
          <DisabledTile key={letter.id}>{letter.letter}</DisabledTile>
        ) : (
          <DraggableTile
            key={letter.id}
            letter={letter}
            dragging={letter.id === item?.letter.id}
          />
        ),
      )}
    </Container>
  );
};

const DraggableTile: FC<DraggableTileProps> = ({ letter, dragging }) => {
  const [collected, drag] = useDrag(() => ({
    type: DragTypes.Tile,
    item: { letter },
  }));

  return (
    <Tile ref={drag} {...collected} dragging={dragging}>
      {letter.letter}
    </Tile>
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
  margin: 0 0 4px;
  box-shadow: rgb(99 99 99 / 20%) 0px -2px 8px 0px;
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
    border-radius: 4px;
  }
`;

const Tile = styled.div<Draggable>`
  height: 50px;
  width: 50px;
  font-weight: 700;
  font-size: 20px;
  margin: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d3d6da;
  user-select: none;
  opacity: ${(p) => (p.dragging ? 0.5 : 1)};
`;

const DisabledTile = styled(Tile)`
  opacity: 0;
`;
