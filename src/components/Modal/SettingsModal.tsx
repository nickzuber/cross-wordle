import { FC } from "react";
import styled from "@emotion/styled";
import { Modal } from "./Modal";

export const SettingsModal: FC = () => {
  return (
    <Modal>
      <Title>Settings</Title>
    </Modal>
  );
};

const Title = styled.h1`
  margin: 0 0 32px;
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: 0.025rem;
  text-transform: uppercase;
  text-align: center;
`;
