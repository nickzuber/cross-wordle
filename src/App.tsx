import "./App.css";
import { GameProvider } from "./contexts/game";
import { ModalsProvider } from "./contexts/modals";
import { ToastProvider } from "./contexts/toast";
import { Scene } from "./Scene";

function App() {
  return (
    <ModalsProvider>
      <ToastProvider>
        <GameProvider>
          <Scene />
        </GameProvider>
      </ToastProvider>
    </ModalsProvider>
  );
}

export default App;
