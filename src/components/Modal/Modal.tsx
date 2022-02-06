import { FC, useContext } from "react";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { SlideIn } from "../../constants/animations";
import { ModalsContext } from "../../contexts/modals";
import { AppTheme } from "../../constants/themes";

type ModalProps = {
  fullscreen?: boolean;
};

export const Modal: FC<ModalProps> = ({ fullscreen = false, children }) => {
  const theme = useTheme() as AppTheme;
  const { closeModal } = useContext(ModalsContext);

  return (
    <Container theme={theme} fullscreen={fullscreen} onClick={(e) => e.stopPropagation()}>
      <Button theme={theme} onClick={closeModal}>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            stroke={theme.colors.text}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M17.25 6.75L6.75 17.25"
          ></path>
          <path
            stroke={theme.colors.text}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M6.75 6.75L17.25 17.25"
          ></path>
        </svg>
      </Button>
      <Content>{children}</Content>
    </Container>
  );
};

const Container = styled.div<{ fullscreen: boolean; theme: AppTheme }>`
  max-width: 600px;
  height: ${(p) => (p.fullscreen ? "100%" : "auto")};
  width: ${(p) => (p.fullscreen ? "100%" : "95%")};
  margin: auto;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background: ${(p) => p.theme.colors.primary};
  padding: 14px 12px;
  animation: ${SlideIn} 250ms;
  animation-fill-mode: forwards;
  box-sizing: border-box;
  z-index: 6;
  border-radius: ${(p) => (p.fullscreen ? "0" : "8px")};
  box-shadow: ${(p) => (p.fullscreen ? "none" : p.theme.accents.dropShadow)};
`;

const Content = styled.div`
  width: 80%;
  height: fit-content;
  margin: 0 auto;

  @media (max-width: 480px) {
    width: 90%;
  }

  @media (max-width: 320px) {
    width: 100%;
  }
`;

const Button = styled.button<{ theme: AppTheme }>`
  border: 0;
  background: none;
  position: absolute;
  height: 40px;
  right: 8px;
  top: 4px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.primary};
  border-radius: 100%;
  cursor: pointer;
  transition: all 50ms ease-in;

  &:active {
    transform: translateY(2px);
    opacity: 0.5;
  }

  svg {
    transform: scale(1.25);
  }
`;
