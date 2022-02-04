import { FC, useContext } from "react";
import styled from "@emotion/styled";
import { ModalsContext } from "../../contexts/modals";
import { InstructionsModal } from "./InstructionsModal";
import { StatsModal } from "./StatsModal";
import { SettingsModal } from "./SettingsModal";
import { FadeIn } from "../../constants/animations";

export const Modal: FC = () => {
  const { isInstructionsOpen, isStatsOpen, isSettingsOpen, isAnyModalOpen, closeModal } =
    useContext(ModalsContext);

  if (!isAnyModalOpen) {
    return null;
  }

  return (
    <Container onClick={closeModal}>
      {isInstructionsOpen ? (
        <InstructionsModal />
      ) : isStatsOpen ? (
        <StatsModal />
      ) : isSettingsOpen ? (
        <SettingsModal />
      ) : null}
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 4;
  background: rgba(100, 100, 100, 0.5);
  animation: ${FadeIn} 250ms;
  animation-fill-mode: forwards;
  overflow-y: auto;
  padding: 24px 0 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
