import styled from "@emotion/styled";
import { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import createPersistedState from "use-persisted-state";
import { Canvas } from "./components";
import { Controls } from "./components/Controls";
import { Header } from "./components/Header";
import { Modal } from "./components/Modal";
import { PersistedStates } from "./constants/state";
import { GameContext } from "./contexts/game";
import { ModalsContext } from "./contexts/modals";
import { useLocalStorageGC } from "./hooks/useLocalStorageGC";
import { countValidLettersOnBoard } from "./utils/board-validator";

const useFirstTime = createPersistedState(PersistedStates.FirstTime);
const useScoreMode = createPersistedState(PersistedStates.ScoreMode);

export const Scene: FC = () => {
  const { width, height } = useWindowSize();
  const { openInstructions, openStats, isStatsOpen } = useContext(ModalsContext);
  const { board, isGameOver } = useContext(GameContext);
  const [isFirstTime] = useFirstTime(true);
  const alreadyShowedConfetti = useRef(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const score = useMemo(() => countValidLettersOnBoard(board), [board]);

  // Clean up old keys.
  useLocalStorageGC();

  // Turn off "score mode" if it was set on previously.
  useResetScoreMode();

  useEffect(() => {
    let ts: ReturnType<typeof setTimeout>;

    if (isGameOver) {
      // + 1000ms for all animations to kick off.
      // + 500ms for the last animation to finish.
      // + 500 for some buffer room to soak in the tile flipping animation.
      ts = setTimeout(openStats, 2000);
    } else if (isFirstTime) {
      // + 100 for some buffer room.
      ts = setTimeout(openInstructions, 100);
    }

    return () => {
      if (ts) {
        clearTimeout(ts);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!alreadyShowedConfetti.current && isStatsOpen && isGameOver && score === 20) {
      alreadyShowedConfetti.current = true;
      setShowConfetti(true);
    }
  }, [isGameOver, isStatsOpen, score]);

  return (
    <Container>
      <Header />
      <Canvas />
      <Controls />
      <Modal />
      {showConfetti ? (
        <Confetti
          numberOfPieces={600}
          opacity={1}
          gravity={0.175}
          width={width}
          height={height}
          recycle={false}
        />
      ) : null}
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  canvas {
    z-index: 9999 !important;
  }
`;

function useResetScoreMode() {
  const [scoreMode, setScoreMode] = useScoreMode(false);

  useEffect(() => {
    if (scoreMode) {
      setScoreMode(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
