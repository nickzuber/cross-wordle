import styled from "@emotion/styled";
import "./App.css";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { Canvas } from "./components";
import { Controls } from "./components/Controls";
import { Header } from "./components/Header";
import { GameProvider } from "./contexts/game";

function App() {
  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <GameProvider>
        <Container>
          <Header />
          <Canvas />
          <Controls />
        </Container>
      </GameProvider>
    </DndProvider>
  );
}

const Container = styled.div`
  max-width: 600px;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

export default App;
