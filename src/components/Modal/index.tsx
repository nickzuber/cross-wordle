import { FC, useContext } from "react";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { ModalsContext } from "../../contexts/modals";
import { InstructionsModal } from "./InstructionsModal";
import { StatsModal } from "./StatsModal";
import { SettingsModal } from "./SettingsModal";
import { FadeIn } from "../../constants/animations";
import { AppTheme } from "../../constants/themes";

export const Modal: FC = () => {
  const theme = useTheme() as AppTheme;
  const { isInstructionsOpen, isStatsOpen, isSettingsOpen, isAnyModalOpen, closeModal } =
    useContext(ModalsContext);

  if (!isAnyModalOpen) {
    return null;
  }

  return (
    <Container theme={theme} onClick={closeModal}>
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

const Container = styled.div<{ theme: AppTheme }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 4;
  background: ${(p) => p.theme.accents.transparentBackground};
  animation: ${FadeIn} 250ms;
  animation-fill-mode: forwards;
  overflow-y: auto;
  padding: 24px 0 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
