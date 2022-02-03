import { FC } from "react";
import styled from "@emotion/styled";
import { Canvas } from "./components";
import { Controls } from "./components/Controls";
import { Header } from "./components/Header";
import { Modal } from "./components/Modal";

export const Scene: FC = () => {
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
