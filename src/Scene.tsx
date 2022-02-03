import { FC, useContext, useEffect } from "react";
import styled from "@emotion/styled";
import { Canvas } from "./components";
import { Controls } from "./components/Controls";
import { Header } from "./components/Header";
import { Modal } from "./components/Modal";
import { ModalsContext } from "./contexts/modals";

export const Scene: FC = () => {
  const { openInstructions } = useContext(ModalsContext);

  useEffect(() => {
    const ts = setTimeout(openInstructions, 100);
    return () => clearTimeout(ts);
  }, []);

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
