import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { css } from "@emotion/react";
import { CursorDirections, Letter, Tile, TileChangeReason, TileState } from "../utils/game";
import {
  createSuccessReveal,
  PopIn,
  createMixedReveal,
  createInvalidReveal,
} from "../constants/animations";
import { GameContext } from "../contexts/game";
import { AppTheme } from "../constants/themes";

type GridTileProps = {
  tile: Tile;
  hasCursor: boolean;
  hasCursorHighlight: boolean;
  handleTileClick: (tile: Tile) => void;
  isGameOver: boolean;
};

export const Board: FC = () => {
  const theme = useTheme() as AppTheme;
  const { board, updateCursor, isGameOver } = useContext(GameContext);

  const handleTileClick = useCallback(
    (tile: Tile) => {
      updateCursor(tile.row, tile.col);
    },
    [updateCursor],
  );

  return (
    <Container theme={theme}>
      {board.tiles.map((row) => {
        const rowId = row.map(({ id }) => id).join(",");
        return (
          <Row key={rowId}>
            {row.map((tile) => (
              <GridTile
                key={tile.id}
                tile={tile}
                handleTileClick={handleTileClick}
                hasCursor={board.cursor.row === tile.row && board.cursor.col === tile.col}
                hasCursorHighlight={
                  board.cursor.direction === CursorDirections.LeftToRight
                    ? board.cursor.row === tile.row
                    : board.cursor.col === tile.col
                }
                isGameOver={isGameOver}
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
  CursorTile,
}

const GridTile: FC<GridTileProps> = ({
  tile,
  hasCursor,
  handleTileClick,
  hasCursorHighlight,
  isGameOver,
}) => {
  const theme = useTheme() as AppTheme;
  const prevLetter = useRef<Letter | null>(tile.letter);
  const prevChangeReason = useRef<TileChangeReason | undefined>(tile.changeReason);
  const [gridTileState, setGridTileState] = useState<GridTileState>(GridTileState.Idle);

  useEffect(() => {
    if (isGameOver) return;

    if (hasCursor) {
      setGridTileState(GridTileState.CursorTile);
    } else {
      setGridTileState(GridTileState.Idle);
    }
  }, [hasCursor, isGameOver]);

  useEffect(() => {
    if (isGameOver) return;

    if (!prevChangeReason.current && tile.changeReason === TileChangeReason.LETTER) {
      setGridTileState(GridTileState.PopIn);
    } else if (tile.changeReason === TileChangeReason.LETTER) {
      setGridTileState(GridTileState.PopIn);
    }

    prevChangeReason.current = tile.changeReason;
  }, [tile.changeReason, isGameOver]);

  useEffect(() => {
    if (isGameOver) return;

    if (
      tile.changeReason === TileChangeReason.LETTER &&
      tile.letter &&
      prevLetter.current !== tile.letter
    ) {
      setGridTileState(GridTileState.PopIn);
    }

    prevLetter.current = tile.letter;
  }, [tile.letter, tile.changeReason, isGameOver]);

  useEffect(() => {
    const state = tile.state;

    if (state === TileState.VALID) {
      setGridTileState(GridTileState.RevealSuccess);
    } else if (state === TileState.MIXED) {
      setGridTileState(GridTileState.RevealMixed);
    } else if (state === TileState.INVALID) {
      setGridTileState(GridTileState.RevealFail);
    }
  }, [tile.state]);

  return (
    <TileWrapper
      onTouchStart={() => handleTileClick(tile)}
      onClick={() => handleTileClick(tile)}
      // This prevents `onClick` from being fired if `onTouchStart` was fired.
      // https://stackoverflow.com/a/56970849/5055063
      onTouchEnd={(e) => e.preventDefault()}
    >
      <TileContents
        hasLetter={!!tile.letter?.letter}
        hasCursor={hasCursor && !isGameOver}
        hasCursorHighlight={hasCursorHighlight && !isGameOver}
        state={gridTileState}
        revealDelay={tile.row * 100 + tile.col * 100}
        theme={theme}
      >
        {tile.letter?.letter}
      </TileContents>
    </TileWrapper>
  );
};

const Container = styled.div<{ theme: AppTheme }>`
  position: relative;
  background: ${(p) => p.theme.colors.primary};
  width: 360px; // 6 tiles * tile size
  height: 360px;

  @media (max-height: 620px), (max-width: 370px) {
    width: 320px; // 6 tiles * tile size
    height: 320px;
  }

  @media (max-height: 580px) {
    width: 290px; // 6 tiles * tile size
    height: 290px;
  }
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
  cursor: pointer;

  @media (max-height: 620px), (max-width: 370px) {
    min-height: 54px;
    min-width: 54px;
    max-height: 54px;
    max-width: 54px;
  }

  @media (max-height: 580px) {
    min-height: 48px;
    min-width: 48px;
    max-height: 48px;
    max-width: 48px;
  }
`;

const TileContents = styled.div<{
  hasLetter: boolean;
  hasCursor: boolean;
  hasCursorHighlight: boolean;
  state: GridTileState;
  revealDelay: number;
  theme: AppTheme;
}>(({ hasLetter, hasCursor, hasCursorHighlight, state, revealDelay, theme }) => {
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
        animation: ${createSuccessReveal(
            theme.colors.text,
            theme.colors.tileSecondary,
            theme.colors.primary,
          )}
          500ms ease-in;
      `;
      break;
    case GridTileState.RevealMixed:
      animationDelay = `${revealDelay}ms`;
      animation = css`
        animation: ${createMixedReveal(
            theme.colors.text,
            theme.colors.tileSecondary,
            theme.colors.primary,
          )}
          500ms ease-in;
      `;
      break;
    case GridTileState.RevealFail:
      animationDelay = `${revealDelay}ms`;
      animation = css`
        animation: ${createInvalidReveal(
            theme.colors.text,
            theme.colors.tileSecondary,
            theme.colors.primary,
          )}
          500ms ease-in;
      `;
      break;
  }

  const cursorColor = "#228be6";
  // const cursorColor = "#f03e3e";
  // const cursorColor = "#be4bdb";
  // const cursorColor = "#845ef7";
  // const cursorColor = "#40c057";
  // const cursorColor = "#f59f00";
  // const cursorColor = "#343a40";

  const backgroundColor = hasCursor
    ? `${cursorColor}22`
    : hasLetter && hasCursorHighlight
    ? `${theme.colors.highlight}88`
    : hasCursorHighlight
    ? theme.colors.highlight
    : theme.colors.primary;
  const borderColor = hasCursor
    ? cursorColor
    : hasLetter
    ? "#787c7e"
    : theme.colors.tileSecondary;

  return css`
    background: ${backgroundColor};
    border: 2px solid ${borderColor};
    transition: border 50ms ease-in, background 50ms ease-in;
    color: ${theme.colors.text};
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
    text-transform: uppercase;

    @media (max-height: 620px), (max-width: 370px) {
      min-height: 45px;
      min-width: 45px;
      max-height: 45px;
      max-width: 45px;
    }

    @media (max-height: 580px) {
      min-height: 40px;
      min-width: 40px;
      max-height: 40px;
      max-width: 40px;
    }
  `;
});
