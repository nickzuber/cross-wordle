import { FC } from "react";
import styled from "@emotion/styled";
import { Modal } from "./Modal";

export const SettingsModal: FC = () => {
  return (
    <Modal>
      <Title>Settings</Title>
      <Paragraph>Nothing here at the moment.</Paragraph>
    </Modal>
  );
};

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
