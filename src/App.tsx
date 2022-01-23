import styled from "@emotion/styled";
import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Canvas } from "./components";
import { Controls } from "./components/Controls";
import { Header } from "./components/Header";

function App() {
  return (
    <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
      <Container>
        <Header />
        <Canvas />
        <Controls />
      </Container>
    </DndProvider>
  );
}

const Container = styled.div`
  max-width: 600px;
  height: 100vh;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

export default App;
