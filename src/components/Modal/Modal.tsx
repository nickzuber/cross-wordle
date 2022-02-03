import { FC, useContext } from "react";
import styled from "@emotion/styled";
import { SlideIn } from "../../constants/animations";
import { ModalsContext } from "../../contexts/modals";

type ModalProps = {
  fullscreen?: boolean;
};

export const Modal: FC<ModalProps> = ({ fullscreen = false, children }) => {
  const { closeModal } = useContext(ModalsContext);

  return (
    <Container fullscreen={fullscreen} onClick={(e) => e.stopPropagation()}>
      <Button onClick={closeModal}>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M17.25 6.75L6.75 17.25"
          ></path>
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M6.75 6.75L17.25 17.25"
          ></path>
        </svg>
      </Button>
      <Content>{children}</Content>
    </Container>
  );
};

const Container = styled.div<{ fullscreen: boolean }>`
  max-width: 600px;
  height: ${(p) => (p.fullscreen ? "100%" : "auto")};
  width: ${(p) => (p.fullscreen ? "100%" : "95%")};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background: #fff;
  padding: 14px 12px;
  animation: ${SlideIn} 250ms;
  animation-fill-mode: forwards;
  box-sizing: border-box;
  z-index: 6;
  margin-top: ${(p) => (p.fullscreen ? "0" : "24px")};
  border-radius: ${(p) => (p.fullscreen ? "0" : "8px")};
  box-shadow: ${(p) => (p.fullscreen ? "none" : "rgb(99 99 99 / 46%) 0px 2px 8px 2px")};
`;

const Content = styled.div`
  width: 80%;
  margin: 0 auto;

  @media (max-width: 480px) {
    width: 90%;
  }

  @media (max-width: 320px) {
    width: 100%;
  }
`;

const Button = styled.button`
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
  background: #ffffff;
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
