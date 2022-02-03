import { FC, useContext, useEffect } from "react";
import styled from "@emotion/styled";
import { Canvas } from "./components";
import { Controls } from "./components/Controls";
import { Header } from "./components/Header";
import { Modal } from "./components/Modal";
import { ModalsContext } from "./contexts/modals";
import createPersistedState from "use-persisted-state";
import { PersistedStates } from "./constants/state";
import { GameContext } from "./contexts/game";

const useFirstTime = createPersistedState(PersistedStates.FirstTime);

export const Scene: FC = () => {
  const { openInstructions, openStats } = useContext(ModalsContext);
  const { isGameOver } = useContext(GameContext);
  const [isFirstTime, setFirstTime] = useFirstTime(true);

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

  return (
    <Container>
      <Header />
      <Canvas />
      <Controls />
      <Modal />
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
`;
