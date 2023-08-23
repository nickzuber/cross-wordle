import { css, useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { FC, Fragment, useContext, useEffect, useMemo, useState } from "react";
import createPersistedState from "use-persisted-state";
import { FadeIn, Shine, createSuccessReveal } from "../../constants/animations";
import { PersistedStates } from "../../constants/state";
import { AppTheme } from "../../constants/themes";
import { GameContext } from "../../contexts/game";
import { ToastContext } from "../../contexts/toast";
import {
  countBoardScore,
  countSolutionBoardScore,
  countValidLettersOnBoard,
  createScoredBoard,
  createScoredSolutionBoard,
  createUnscoredBoard,
} from "../../utils/board-validator";
import { Config, isBoardScored } from "../../utils/game";
import { Modal } from "./Modal";

const useScoreMode = createPersistedState(PersistedStates.ScoreMode);

function zeroPad(num: number, places: number) {
  return String(num).padStart(places, "0");
}

function getTimeLeftInDay() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const ms = tomorrow.getTime() - today.getTime();
  const seconds = ms / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;

  return `${zeroPad(Math.floor(hours), 2)}:${zeroPad(Math.floor(minutes % 60), 2)}:${zeroPad(
    Math.floor(seconds % 60),
    2,
  )}`;
}

function letterCountToCompliment(score: number) {
  if (score < 10) {
    return "Better luck next time!";
  }
  if (score < 14) {
    return "Not too shabby!";
  }
  if (score < 16) {
    return "Nice.";
  }
  if (score < 20) {
    return "Awesome!";
  }
  if (score >= 20) {
    return "Perfect — you're amazing!";
  }
  return "";
}

function scoreToCompliment(score: number, target: number) {
  if (score < target) {
    return "Better luck next time!";
  }
  if (score === target) {
    return "Right on point!";
  }
  if (score > 30) {
    return "Wow, great score!";
  }
  if (score > 40) {
    return "You are a legend — this score is insanely rare!";
  }
  if (score > target) {
    return "Great job!";
  }
  return "";
}

export const StatsModal: FC = () => {
  const theme = useTheme() as AppTheme;
  const {
    board,
    solutionBoard,
    getShareClipboardItem,
    getScoredShareClipboardItem,
    isGameOver,
  } = useContext(GameContext);
  const { sendToast } = useContext(ToastContext);
  const [timeLeft, setTimeLeft] = useState(getTimeLeftInDay());
  const [showPreview, setShowPreview] = useState(false);
  const [scoreMode] = useScoreMode(false);

  const getShareClipboardItemForBoard = scoreMode
    ? getScoredShareClipboardItem
    : getShareClipboardItem;

  // Solution board but with a score for each tile.
  const scoredSolutionBoard = useMemo(
    () => createScoredSolutionBoard(solutionBoard),
    [solutionBoard],
  );

  const yourBoard = useMemo(
    () => (scoreMode ? createScoredBoard(board) : createUnscoredBoard(board)),
    [board, scoreMode],
  );

  const showScoredBoard = scoreMode && isBoardScored(yourBoard);

  useEffect(() => {
    const ts = setInterval(() => setTimeLeft(getTimeLeftInDay()), 1000);
    return () => clearInterval(ts);
  }, []);

  async function onShareResults() {
    const results = await getShareClipboardItemForBoard();
    if (!results) {
      sendToast("Something went wrong.");
      return;
    }

    const [clipboardItem, imageFile] = results;
    if (navigator.share) {
      navigator
        .share({
          files: [imageFile],
        })
        .catch(() =>
          navigator.clipboard
            .write([clipboardItem])
            .then(() => sendToast("Copied to clipboard!"))
            .catch(() =>
              sendToast("Something went wrong with your device's native sharing options."),
            ),
        );
    } else if (navigator.clipboard) {
      navigator.clipboard
        .write([clipboardItem])
        .then(() => sendToast("Copied to clipboard!"))
        .catch(() => sendToast("Something went wrong with your device's clipboard."));
    } else {
      sendToast("Something went wrong.");
    }
  }

  return (
    <Modal>
      <Title>Statistics</Title>
      {isGameOver ? (
        <Fragment>
          {showScoredBoard ? (
            <Paragraph>
              Your score today was
              <Result>
                {countBoardScore(yourBoard)}/{countSolutionBoardScore(scoredSolutionBoard)}
              </Result>
              compared to today's target.
              <br />
              <b>
                {scoreToCompliment(
                  countBoardScore(yourBoard),
                  countSolutionBoardScore(scoredSolutionBoard),
                )}
              </b>
            </Paragraph>
          ) : (
            <Paragraph>
              You were able to correctly use
              <Result>
                {countValidLettersOnBoard(board)}/{Config.MaxLetters}
              </Result>
              letters on your board.
              <br />
              <b>{letterCountToCompliment(countValidLettersOnBoard(board))}</b>
            </Paragraph>
          )}
        </Fragment>
      ) : null}
      {!isGameOver ? (
        <MiniBoard
          theme={theme}
          hidePreview={true}
          message="You must submit your board before you can see today's original solution"
          isGameOver={isGameOver}
        >
          <MiniBoardEmptyRows />
        </MiniBoard>
      ) : (
        <MiniBoard
          theme={theme}
          hidePreview={!showPreview}
          message="Tap to see today's original solution"
          isGameOver={isGameOver}
          onClick={() => setShowPreview(true)}
        >
          {showScoredBoard
            ? scoredSolutionBoard.map((row, r) => {
                return (
                  <MiniRow key={r}>
                    {row.map((tile, c) => (
                      <MiniTileWrapper key={`${r}${c}`}>
                        {tile.letter && showPreview ? (
                          <MiniTileContentsSuccess
                            theme={theme}
                            animationDelay={r * 100 + c * 100}
                            score={tile.score}
                          >
                            {tile.letter}
                            <>
                              <ShineContainer>
                                <ShineWrapper score={tile.score} />
                              </ShineContainer>
                              <Score revealDelay={r * 100 + c * 100}>{tile.score}</Score>
                            </>
                          </MiniTileContentsSuccess>
                        ) : (
                          <MiniTileContents theme={theme} />
                        )}
                      </MiniTileWrapper>
                    ))}
                  </MiniRow>
                );
              })
            : solutionBoard.map((row, r) => {
                return (
                  <MiniRow key={r}>
                    {row.map((letter, c) => (
                      <MiniTileWrapper key={`${r}${c}`}>
                        {letter && showPreview ? (
                          <MiniTileContentsSuccess
                            theme={theme}
                            animationDelay={r * 100 + c * 100}
                          >
                            {letter}
                          </MiniTileContentsSuccess>
                        ) : (
                          <MiniTileContents theme={theme} />
                        )}
                      </MiniTileWrapper>
                    ))}
                  </MiniRow>
                );
              })}
        </MiniBoard>
      )}

      {isGameOver ? (
        <ShareContainer>
          <ShareSection>
            <Clock>{timeLeft}</Clock>
          </ShareSection>
          <ShareSection>
            <ShareButton onClick={onShareResults}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.25 7C19.25 8.24264 18.2426 9.25 17 9.25C15.7574 9.25 14.75 8.24264 14.75 7C14.75 5.75736 15.7574 4.75 17 4.75C18.2426 4.75 19.25 5.75736 19.25 7Z"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M9.25 12C9.25 13.2426 8.24264 14.25 7 14.25C5.75736 14.25 4.75 13.2426 4.75 12C4.75 10.7574 5.75736 9.75 7 9.75C8.24264 9.75 9.25 10.7574 9.25 12Z"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M19.25 17C19.25 18.2426 18.2426 19.25 17 19.25C15.7574 19.25 14.75 18.2426 14.75 17C14.75 15.7574 15.7574 14.75 17 14.75C18.2426 14.75 19.25 15.7574 19.25 17Z"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M14.5 16L9 13.5"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M14.5 8.5L9 11"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </ShareButton>
          </ShareSection>
        </ShareContainer>
      ) : (
        <SpacingContainer />
      )}
    </Modal>
  );
};

const MiniBoardEmptyRows = () => {
  const theme = useTheme() as AppTheme;
  return (
    <Fragment>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents theme={theme} />
        </MiniTileWrapper>
      </MiniRow>
    </Fragment>
  );
};

const MiniBoard = styled.div<{
  isGameOver: boolean;
  hidePreview?: boolean;
  message?: string;
  theme: AppTheme;
}>`
  position: relative;
  background: ${(p) => p.theme.colors.primary};
  width: 240px; // 6 tiles * tile size
  height: 240px;
  margin: 0 auto;

  ${(p) =>
    p.hidePreview
      ? `
          &:after {
            content: "${p.message || ""}";
            background: ${p.theme.colors.primary}14;
            position: absolute;
            top: -10px;
            bottom: -10px;
            right: -10px;
            left: -10px;
            backdrop-filter: blur(3px);
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            font-size: 1.25rem;
            font-weight: 600;
            padding: 12px 24px;
            text-shadow: 0px 0px 2px #5b5b5b2b;
            cursor: ${p.isGameOver ? "pointer" : "default"};
        }
          }
        `
      : null}
`;

const MiniRow = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MiniTileWrapper = styled.div`
  position: relative;
  min-height: 40px;
  min-width: 40px;
  max-height: 40px;
  max-width: 40px;
  height: 100%;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: default;
`;

const MiniTileContents = styled.div<{ theme: AppTheme }>`
  background: ${(p) => p.theme.colors.primary};
  border: 2px solid ${(p) => p.theme.colors.tileSecondary};
  transition: border 50ms ease-in, background 50ms ease-in;
  color: ${(p) => p.theme.colors.text};
  min-height: 33px;
  min-width: 33px;
  max-height: 33px;
  max-width: 33px;
  height: calc(100% - 10px);
  width: calc(100% - 10px);
  opacity: 1;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  text-transform: uppercase;
`;

const MiniTileContentsSuccess = styled(MiniTileContents)<{
  animationDelay: number;
  theme: AppTheme;
  score?: number;
}>`
  animation: ${(p) =>
      createSuccessReveal(
        p.theme.colors.text,
        p.theme.colors.tileSecondary,
        p.theme.colors.primary,
        p.score,
      )}
    500ms ease-in;
  animation-delay: ${(p) => p.animationDelay}ms;
  animation-fill-mode: forwards;
`;

// ====================================================

const Title = styled.h1`
  margin: 0 0 24px;
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: 0.025rem;
  text-transform: uppercase;
  text-align: center;
`;

const Paragraph = styled.p`
  font-weight: 500;
  font-size: 1rem;
  text-align: center;
  width: 75%;
  margin: 0 auto 24px;
`;

const Result = styled.span`
  font-weight: 700;
  text-align: center;
  font-size: 1.5rem;
  text-shadow: 0px 1px 2px #5d5d5d4f;
  margin: 8px auto;
  display: block;
`;

const SpacingContainer = styled.div`
  width: 100%;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 12px auto 0;
`;

const ShareContainer = styled.div`
  width: 100%;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 36px auto 24px;
`;

const Clock = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-family: "IBM Plex Mono", monospace;
`;

const ShareSection = styled.div`
  width: 50%;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ShareButton = styled.button`
  height: 40px;
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.25px;
  border: none;
  background: #6aaa64;
  color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
  transition: background 100ms ease-in;

  &:hover {
    background: #649d5e;
  }

  &:active {
    background: #5e9153;
  }

  svg {
    transform: scale(1);
  }

  &:before {
    font-size: 16px;
    content: "Share";
    margin-right: 8px;
  }
`;

const Score = styled.div<{ revealDelay: number }>(({ revealDelay }) => {
  return css`
    position: absolute;
    bottom: 1px;
    right: 1px;
    font-size: 10px;
    line-height: 10px;
    font-weight: 600;
    opacity: 0;

    animation: ${FadeIn} 300ms ease-in-out 1;
    animation-delay: ${revealDelay}ms;
    animation-fill-mode: forwards;
  `;
});

const SmallSpan = styled.span`
  display: inline-block;
  font-size: 14px;
  line-height: 14px;
  margin-left: 4px;
`;

const ShineContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
`;

const ShineWrapper = styled.div<{ score: number | undefined }>(({ score }) => {
  if (!score) {
    return css``;
  }

  if (score === 1) {
    return css``;
  }

  return css`
    animation: ${Shine} 4s ease-in-out infinite;
    animation-fill-mode: forwards;
    content: "";
    position: absolute;
    top: -110%;
    left: -210%;
    width: 200%;
    height: 200%;
    opacity: 0;
    transform: rotate(30deg);

    background: rgba(255, 255, 255, 0.13);
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.13) 0%,
      rgba(255, 255, 255, 0.13) 77%,
      rgba(255, 255, 255, 0.5) 92%,
      rgba(255, 255, 255, 0) 100%
    );
  `;
});
