import { FC, useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { Canvas } from "./components";
import { Controls } from "./components/Controls";
import { Header } from "./components/Header";
import { Modal } from "./components/Modal";
import { ModalsContext } from "./contexts/modals";
import createPersistedState from "use-persisted-state";
import { PersistedStates } from "./constants/state";
import { GameContext } from "./contexts/game";
import { useLocalStorageGC } from "./hooks/useLocalStorageGC";
import { countValidLettersOnBoard } from "./utils/board-validator";

const useFirstTime = createPersistedState(PersistedStates.FirstTime);

export const Scene: FC = () => {
  const { width, height } = useWindowSize();
  const { openInstructions, openStats, isStatsOpen } = useContext(ModalsContext);
  const { board, isGameOver } = useContext(GameContext);
  const [isFirstTime, setFirstTime] = useFirstTime(true);
  const alreadyShowedConfetti = useRef(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const score = useMemo(() => countValidLettersOnBoard(board), [board]);

  // Clean up old keys.
  useLocalStorageGC();

  useEffect(() => {
    let ts: ReturnType<typeof setTimeout>;

    if (isGameOver) {
      // + 1000ms for all animations to kick off.
      // + 500ms for the last animation to finish.
      // + 100 for some buffer room.
      ts = setTimeout(openStats, 1600);
    } else if (isFirstTime) {
      // + 100 for some buffer room.
      ts = setTimeout(openInstructions, 100);
      setFirstTime(false);
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
