import styled from "@emotion/styled";
import "./App.css";
import { Canvas } from "./components";
import { Controls } from "./components/Controls";
import { Header } from "./components/Header";

function App() {
  return (
    <Container>
      <Header />
      <Canvas />
      <Controls />
    </Container>
  );
}

const Container = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

export default App;
