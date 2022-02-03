import "./App.css";
import { GameProvider } from "./contexts/game";
import { ModalsProvider } from "./contexts/modals";
import { Scene } from "./Scene";

function App() {
  return (
    <ModalsProvider>
      <GameProvider>
        <Scene />
      </GameProvider>
    </ModalsProvider>
  );
}

export default App;
