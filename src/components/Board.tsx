import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { CursorDirections, Letter, Tile, TileState } from "../utils/game";
import {
  SuccessReveal,
  PopIn,
  MixedReveal,
  InvalidReveal,
} from "../constants/animations";
import { GameContext } from "../contexts/game";

type GridTileProps = {
  tile: Tile;
  hasCursor: boolean;
  hasCursorHighlight: boolean;
  handleTileClick: (tile: Tile) => void;
};

export const Board: FC = () => {
  const { board, updateCursor } = useContext(GameContext);

  const handleTileClick = useCallback(
    (tile: Tile) => {
      updateCursor(tile.row, tile.col);
    },
    [updateCursor],
  );

  return (
    <Container>
      {board.tiles.map((row) => {
        const rowId = row.map(({ id }) => id).join(",");
        return (
          <Row key={rowId}>
            {row.map((tile) => (
              <GridTile
                key={tile.id}
                tile={tile}
                handleTileClick={handleTileClick}
                hasCursor={
                  board.cursor.row === tile.row && board.cursor.col === tile.col
                }
                hasCursorHighlight={
                  board.cursor.direction === CursorDirections.LeftToRight
                    ? board.cursor.row === tile.row
                    : board.cursor.col === tile.col
                }
              />
            ))}
          </Row>
        );
      })}
    </Container>
  );
};

enum GridTileState {
  Idle,
  PopIn,
  RevealSuccess,
  RevealMixed,
  RevealFail,
}

const GridTile: FC<GridTileProps> = ({
  tile,
  hasCursor,
  handleTileClick,
  hasCursorHighlight,
}) => {
  const prevTileState = useRef<TileState>(tile.state);
  const prevLetter = useRef<Letter | null>(tile.letter);
  const [gridTileState, setGridTileState] = useState<GridTileState>(
    GridTileState.Idle,
  );

  // idea -- have an additional property on tiles that represent the finish request uuid
  // this way we can tell if another finish request was made even if the tile state hasn't changed.

  useEffect(() => {
    if (!prevLetter.current && tile.letter) {
      setGridTileState(GridTileState.PopIn);
    } else if (prevLetter.current !== tile.letter) {
      setGridTileState(GridTileState.PopIn);
    }

    prevLetter.current = tile.letter;
  }, [tile.letter]);

  useEffect(() => {
    // const prevState = prevTileState.current;
    const state = tile.state;

    if (state === TileState.VALID) {
      setGridTileState(GridTileState.RevealSuccess);
    } else if (state === TileState.MIXED) {
      setGridTileState(GridTileState.RevealMixed);
    } else if (state === TileState.INVALID) {
      setGridTileState(GridTileState.RevealFail);
    }

    prevTileState.current = tile.state;
  }, [tile.state]);

  return (
    <TileWrapper onClick={() => handleTileClick(tile)}>
      <TileContents
        hasCursor={hasCursor}
        hasCursorHighlight={hasCursorHighlight}
        state={gridTileState}
        revealDelay={tile.row * 100 + tile.col * 100}
      >
        {tile.letter?.letter}
      </TileContents>
    </TileWrapper>
  );
};

const Container = styled.div`
  position: relative;
  background: #ffffff;
  width: 360px; // 6 tiles * tile size
  height: 360px;
`;

const Row = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TileWrapper = styled.div`
  position: relative;
  min-height: 60px;
  min-width: 60px;
  max-height: 60px;
  max-width: 60px;
  height: 100%;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const TileContents = styled.div<{
  hasCursor: boolean;
  hasCursorHighlight: boolean;
  state: GridTileState;
  revealDelay: number;
}>(({ hasCursor, hasCursorHighlight, state, revealDelay }) => {
  let animation;
  let animationDelay = "0ms";

  switch (state) {
    case GridTileState.PopIn:
      animation = css`
        animation: ${PopIn} 100ms;
      `;
      break;
    case GridTileState.RevealSuccess:
      animationDelay = `${revealDelay}ms`;
      animation = css`
        animation: ${SuccessReveal} 500ms ease-in;
      `;
      break;
    case GridTileState.RevealMixed:
      animationDelay = `${revealDelay}ms`;
      animation = css`
        animation: ${MixedReveal} 500ms ease-in;
      `;
      break;
    case GridTileState.RevealFail:
      animationDelay = `${revealDelay}ms`;
      animation = css`
        animation: ${InvalidReveal} 500ms ease-in;
      `;
      break;
  }

  return css`
    border: ${hasCursor ? "2px solid #787c7e !important" : "2px solid #d3d6da"};
    background: ${hasCursorHighlight ? "#eaeaea" : "#ffffff"};
    color: #1a1a1b;
    min-height: 50px;
    min-width: 50px;
    max-height: 50px;
    max-width: 50px;
    height: calc(100% - 10px);
    width: calc(100% - 10px);
    opacity: 1;
    font-weight: 700;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    ${animation}
    animation-delay: ${animationDelay};
    animation-fill-mode: forwards;
  `;
});
