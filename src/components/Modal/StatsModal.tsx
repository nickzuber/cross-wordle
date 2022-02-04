import { FC, Fragment, useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Modal } from "./Modal";
import { GameContext } from "../../contexts/game";
import { SuccessReveal } from "../../constants/animations";
import { countValidLettersOnBoard } from "../../utils/board-validator";
import { Config } from "../../utils/game";

const BaseDelay = 250;

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

function scoreToCompliment(score: number) {
  if (score < 5) {
    return "Better luck next time!";
  }
  if (score < 10) {
    return "Not too shabby!";
  }
  if (score < 14) {
    return "Nice.";
  }
  if (score < 18) {
    return "Awesome!";
  }
  if (score >= 20) {
    return "Perfect — you're amazing!";
  }
  return "";
}

export const StatsModal: FC = () => {
  const { board, solutionBoard, getShareLink, isGameOver } = useContext(GameContext);
  const [timeLeft, setTimeLeft] = useState(getTimeLeftInDay());
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const ts = setInterval(() => setTimeLeft(getTimeLeftInDay()), 1000);
    return () => clearInterval(ts);
  }, []);

  function onShareResults() {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          text: getShareLink(),
          url: window.location.href,
        })
        .catch((err) => console.info(err));
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(getShareLink()).catch((err) => console.info(err));
    }
  }

  return (
    <Modal>
      <Title>Statistics</Title>
      {isGameOver ? (
        <Fragment>
          <Paragraph>
            You were able to place
            <Result>
              {countValidLettersOnBoard(board)}/{Config.MaxLetters}
            </Result>
            letters on the board.
            <br />
            <b>{scoreToCompliment(countValidLettersOnBoard(board))}</b>
          </Paragraph>
        </Fragment>
      ) : null}
      {!isGameOver ? (
        <MiniBoard
          hidePreview={true}
          message="You must submit your board before you can see today's original solution"
        >
          <MiniBoardEmptyRows />
        </MiniBoard>
      ) : (
        <MiniBoard
          hidePreview={!showPreview}
          message="Tap to see today's original solution"
          onClick={() => setShowPreview(true)}
        >
          {solutionBoard.map((row, r) => {
            return (
              <MiniRow key={r}>
                {row.map((letter, c) => (
                  <MiniTileWrapper key={`${r}${c}`}>
                    {letter && showPreview ? (
                      <MiniTileContentsSuccess animationDelay={r * 100 + c * 100}>
                        {letter}
                      </MiniTileContentsSuccess>
                    ) : (
                      <MiniTileContents />
                    )}
                  </MiniTileWrapper>
                ))}
              </MiniRow>
            );
          })}
        </MiniBoard>
      )}

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
    </Modal>
  );
};

const MiniBoardEmptyRows = () => {
  return (
    <Fragment>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
      </MiniRow>
      <MiniRow>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
        <MiniTileWrapper>
          <MiniTileContents />
        </MiniTileWrapper>
      </MiniRow>
    </Fragment>
  );
};

const MiniBoard = styled.div<{ hidePreview?: boolean; message?: string }>`
  position: relative;
  background: #ffffff;
  width: 240px; // 6 tiles * tile size
  height: 240px;
  margin: 0 auto;

  ${(p) =>
    p.hidePreview
      ? `
          &:after {
            content: "${p.message || ""}";
            background: #ffffff14;
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
            cursor: pointer;
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

const MiniTileContents = styled.div`
  background: #ffffff;
  border: 2px solid #d3d6da;
  transition: border 50ms ease-in, background 50ms ease-in;
  color: #1a1a1b;
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

const MiniTileContentsSuccess = styled(MiniTileContents)<{ animationDelay: number }>`
  animation: ${SuccessReveal} 500ms ease-in;
  animation-delay: ${(p) => BaseDelay + p.animationDelay}ms;
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

const ShareContainer = styled.div`
  width: 100%;
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 24px auto;
`;

const Clock = styled.div`
  font-size: 18px;
  font-weight: 600;
  font-family: "SF Mono", monospace;
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
