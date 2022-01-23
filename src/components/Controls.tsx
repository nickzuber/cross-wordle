import { FC } from "react";
import styled from "@emotion/styled";
import { useLetters } from "../hooks/useLetters";
import { useDrag } from "react-dnd";
import { DragTypes } from "../constants.ts/game";
import { Letter } from "../utils/game";

type DraggableTileProps = {
  letter: Letter;
};

export const Controls: FC = () => {
  const { letters } = useLetters();

  return (
    <Container>
      {letters.map((letter) => (
        <DraggableTile key={letter.id} letter={letter} />
      ))}
    </Container>
  );
};

const DraggableTile: FC<DraggableTileProps> = ({ letter }) => {
  const [collected, drag, dragPreview] = useDrag(() => ({
    type: DragTypes.Tile,
    item: { ...letter },
  }));

  return (
    <Tile ref={drag} {...collected}>
      {letter.letter}
    </Tile>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const Tile = styled.div`
  height: 30px;
  width: 30px;
  margin: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d3d6da;
`;
